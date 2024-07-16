import { Request, Response } from "express";
import InfractionRepository from "../repositories/InfractionRepository";
import UserRepository from "../repositories/UserRepository";
import PaymentRepository from "../repositories/PaymentRepository";
import { paymentTypes } from "../models/PaymentModel";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { checkUuid } from "../middleware/Validation";

class PaymentController {
  async payInfractionByUuid(req: Request, res: Response): Promise<void> {
    const { uuid } = req.body;

    if (!checkUuid(uuid, res)) {
      return;
    }

    const infraction = await InfractionRepository.getByUuid(uuid);

    if (!infraction) {
      res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
      return;
    }

    if (infraction.userId !== req.user!.userId) {
      res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
      return;
    }

    if (infraction.paid) {
      res.status(StatusCodes.CONFLICT).json({ message: "Fine already paid" });
      return;
    }

    //Check user's balance
    const fineAmount = infraction.amount;
    const userCredit = await UserRepository.getCredit(infraction.userId);
    if (userCredit! < fineAmount) {
      res
        .status(StatusCodes.PAYMENT_REQUIRED)
        .json({ message: "Insufficient Balance" });
      return;
    }

    const updated = await InfractionRepository.markAsPaid(infraction);
    if (!updated) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
      return;
    }

    infraction.paid = true;

    const paymentData = {
      userId: infraction.userId,
      amount: -fineAmount,
      paymentType: paymentTypes.finePayment,
      fineId: infraction.id,
    };
    const payment = await PaymentRepository.createPayment(paymentData);

    await UserRepository.decreaseCredit(req.user!.userId, fineAmount);

    res.status(StatusCodes.OK).json(infraction);
  }
}

export default new PaymentController();
