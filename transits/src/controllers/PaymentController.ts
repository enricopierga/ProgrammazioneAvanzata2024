import { Request, Response } from "express";
import InfractionRepository from "../repositories/InfractionRepository";
import { StatusCodes } from "http-status-codes";

class PaymentController {
  async payInfractionByUuid(req: Request, res: Response): Promise<void> {
    try {
      const { uuidPayment } = req.body;
      // Trova l'infrazione associata tramite UUID
      const infraction = await InfractionRepository.getByUuid(uuidPayment);
      if (!infraction) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Infraction not found" });
        return;
      }

      // Assicurarsi che l'infrazione non sia già stata pagata
      if (infraction.paid) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Fine already paid" });
        return;
      }

      // Aggiorna lo stato dell'infrazione come pagata
      infraction.paid = true;
      await InfractionRepository.update(infraction.id, infraction);

      res
        .status(StatusCodes.OK)
        .json({ message: "Fine paid successfully", infraction });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error", error });
    }
  }
}

export default new PaymentController();
