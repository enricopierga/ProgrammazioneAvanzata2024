import { Request, Response } from "express";
import InfractionRepository from "../repositories/InfractionRepository";
import { StatusCodes } from "http-status-codes";
import {
  checkDateFormat,
  checkDateOrder,
  checkLicensePlate,
} from "../middleware/Validation";

class InfractionController {
  /**
   * Retrieves infractions based on license plates and a date range.
   * Expects a request body containing 'plates', 'startDate', and 'endDate'.
   * Responds with the infractions or an error message.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async getByPlatesAndPeriod(req: Request, res: Response): Promise<void> {
    try {
      const { plates, startDate, endDate } = req.body;

      // Extract userId from the middleware
      const requestingUserId = req.user?.userId; // userId dal middleware
      if (!requestingUserId) {
        res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
        return;
      }

      // Check if the user is an operator
      const isOperator = req.user?.role === "Operatore";

      // Check if plates, startDate, and endDate are present
      if (!plates || !startDate || !endDate) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Missing plates or date range" });
        return;
      }

      // Check if plates is an array and if each plate has the correct format
      if (
        !Array.isArray(plates) ||
        !plates.every((plate) => checkLicensePlate(plate, res))
      ) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message:
            "Invalid plate format. Plates should be an array of strings with format 'AB123CD'",
        });
        return;
      }

      // Check if startDate and endDate have a valid date format
      if (!checkDateFormat(startDate, res) || !checkDateFormat(endDate, res)) {
        return;
      }

      // Check if startDate is before endDate
      if (!checkDateOrder(startDate, endDate, res)) {
        return;
      }

      // Retrieve infractions from the repository
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
