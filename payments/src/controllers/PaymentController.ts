import { Request, Response } from "express"; // Import Request and Response types from Express
import InfractionRepository from "../repositories/InfractionRepository"; // Import the InfractionRepository
import UserRepository from "../repositories/UserRepository"; // Import the UserRepository
import PaymentRepository from "../repositories/PaymentRepository"; // Import the PaymentRepository
import { paymentTypes } from "../models/PaymentModel"; // Import payment types from PaymentModel
import { ReasonPhrases, StatusCodes } from "http-status-codes"; // Import HTTP status codes and reason phrases
import { checkUuid } from "../middlewares/Validation"; // Import the UUID validation middleware

class PaymentController {
  // Method to pay an infraction by UUID
  async payInfractionByUuid(req: Request, res: Response): Promise<void> {
    const { uuid } = req.body;

    // Validate the UUID
    if (!checkUuid(uuid, res)) {
      return;
    }

    // Retrieve the infraction by UUID
    const infraction = await InfractionRepository.getByUuid(uuid);

    // Check if infraction exists
    if (!infraction) {
      res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
      return;
    }

    // Check if the infraction belongs to the authenticated user
    if (infraction.userId !== req.user!.userId) {
      res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
      return;
    }

    // Check if the infraction is already paid
    if (infraction.paid) {
      res.status(StatusCodes.CONFLICT).json({ message: "Fine already paid" });
      return;
    }

    // Check user's balance
    const fineAmount = infraction.amount;
    const userCredit = await UserRepository.getCredit(infraction.userId);
    if (userCredit! < fineAmount) {
      res
        .status(StatusCodes.PAYMENT_REQUIRED)
        .json({ message: "Insufficient Balance" });
      return;
    }

    // Mark the infraction as paid
    const updated = await InfractionRepository.markAsPaid(infraction);
    if (!updated) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
      return;
    }

    infraction.paid = true;

    // Create a payment record
    const paymentData = {
      userId: infraction.userId,
      amount: -fineAmount,
      paymentType: paymentTypes.finePayment,
      fineId: infraction.id,
    };
    const payment = await PaymentRepository.createPayment(paymentData);

    // Decrease the user's credit
    await UserRepository.decreaseCredit(req.user!.userId, fineAmount);

    // Respond with the updated infraction
    res.status(StatusCodes.OK).json(infraction);
  }
}

export default new PaymentController(); // Export an instance of PaymentController
