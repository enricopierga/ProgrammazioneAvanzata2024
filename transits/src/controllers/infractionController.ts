// src/controllers/InfractionController.ts
import { Request, Response } from "express";
import InfractionRepository from "../repositories/InfractionRepository";
import UserRepository from "../repositories/UserRepository";
import { StatusCodes } from "http-status-codes";
import {
  checkDateFormat,
  checkDateOrder,
  checkLicensePlate,
} from "../middleware/Validation";

class InfractionController {
  async getByPlatesAndPeriod(req: Request, res: Response): Promise<void> {
    try {
      const { plates, startDate, endDate } = req.body;
      const requestingUserId = Number(req.params.id);
      const requestingUser = await UserRepository.getById(requestingUserId);

      // Verifica che plates, startDate e endDate siano presenti
      if (!plates || !startDate || !endDate) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Missing plates or date range" });
        return;
      }

      // Verifica che plates sia un array e che ogni targa abbia il formato corretto
      if (
        !Array.isArray(plates) ||
        !plates.every((plate) => checkLicensePlate(plate))
      ) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message:
            "Invalid plate format. Plates should be an array of strings with format 'AB123CD'",
        });
        return;
      }

      // Verifica che startDate e endDate abbiano un formato di data valido
      if (!checkDateFormat(startDate, res) || !checkDateFormat(endDate, res)) {
        return;
      }

      // Verifica che startDate sia prima di endDate
      if (!checkDateOrder(startDate, endDate, res)) {
        return;
      }

      // Verifica che l'utente richiedente esista
      if (!requestingUser) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        return;
      }

      const isOperator = requestingUser.role === "Operatore";
      const infractions = await InfractionRepository.getByPlatesAndPeriod(
        plates,
        startDate,
        endDate,
        isOperator,
        requestingUserId
      );
      res.status(StatusCodes.OK).json(infractions);
      return;
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching infraction(s)" });
    }
  }
}

export default new InfractionController();
