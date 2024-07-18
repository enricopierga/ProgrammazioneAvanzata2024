import { Request, Response } from "express";
import VehicleRepository from "../repositories/VehicleRepository";
import {
  checkLicensePlate,
  checkUserId,
  checkVehicleType,
} from "../middleware/Validation";
import { StatusCodes } from "http-status-codes";

class VehicleController {
  /**
   * Creates a new vehicle.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { licensePlate, type, userId } = req.body;

      if (!checkLicensePlate(licensePlate, res)) {
        return;
      }

      if (!checkVehicleType(type, res)) {
        return;
      }

      if (await checkUserId(userId, res)) {
        const vehicle = await VehicleRepository.create(req.body);
        res.status(StatusCodes.CREATED).json(vehicle);
        return;
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error creating vehicle" });
    }
  }

  /**
   * Retrieves a vehicle by vehicleId or all vehicles if vehicleId is not specified as query parameter.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async getVehicle(req: Request, res: Response): Promise<void> {
    try {
      if (req.query.vehicleId) {
        const vehicleId = Number(req.query.vehicleId);

        if (isNaN(vehicleId)) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Invalid ID format" });
          return;
        }

        const vehicle = await VehicleRepository.getById(vehicleId);

        if (vehicle) {
          res.status(StatusCodes.OK).json(vehicle);
          return;
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Vehicle not found" });
          return;
        }
      } else {
        const vehicles = await VehicleRepository.getAll();
        res.status(StatusCodes.OK).json(vehicles);
        return;
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error retrieving vehicle(s)" });
    }
  }

  /**
   * Updates a vehicle.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const vehicleId = Number(req.params.vehicleId);

      if (isNaN(vehicleId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid ID format" });
        return;
      }

      const { licensePlate, type, userId } = req.body;

      if (!checkLicensePlate(licensePlate, res)) {
        return;
      }

      if (!checkVehicleType(type, res)) {
        return;
      }

      if (await checkUserId(userId, res)) {
        const updated = await VehicleRepository.update(vehicleId, req.body);

        if (updated) {
          res
            .status(StatusCodes.OK)
            .json({ message: "Vehicle updated successfully" });
          return;
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Vehicle not found" });
          return;
        }
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error updating vehicle" });
    }
  }

  /**
   * Deletes a vehicle.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const vehicleId = Number(req.params.vehicleId);

      if (isNaN(vehicleId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid ID format" });
        return;
      }

      const deleted = await VehicleRepository.delete(vehicleId);
      if (deleted) {
        res
          .status(StatusCodes.OK)
          .json({ message: "Vehicle deleted successfully" });
        return;
      } else {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Vehicle not found" });
        return;
      }
    } catch (err) {
      const error = err as Error;
      if (error.message.includes("Cannot delete vehicle")) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Error deleting vehicle" });
      }
    }
  }
}

export default new VehicleController();
