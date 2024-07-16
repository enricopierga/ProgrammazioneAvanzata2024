// src/controllers/TransitController.ts
import { Request, Response } from "express";
import TransitRepository from "../repositories/TransitRepository";
import VehicleRepository from "../repositories/VehicleRepository";
import RouteRepository from "../repositories/RouteRepository";
import InfractionRepository from "../repositories/InfractionRepository";
import { StatusCodes } from "http-status-codes";
import {
  SPEED_LIMIT_CAR_CLEAR,
  SPEED_LIMIT_CAR_RAINY,
  SPEED_LIMIT_TRUCK_CLEAR,
  SPEED_LIMIT_TRUCK_RAINY,
  FINE_AMOUNT,
} from "../config/constants";
import { checkWeather } from "../middleware/Validation";

class TransitController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleId, routeId, travelTime, weather } = req.body;
      if (isNaN(vehicleId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid vehicleId format" });
        return;
      }

      if (isNaN(routeId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid routeId format" });
        return;
      }

      if (isNaN(travelTime)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid routeId format" });
        return;
      }

      if (!checkWeather(weather, res)) {
        return;
      }

      const transit = await TransitRepository.create(req.body); // crea il transito
      const vehicle = await VehicleRepository.getById(vehicleId);
      const route = await RouteRepository.getById(routeId);

      if (!vehicle) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Vehicle not found" });
        return;
      }

      if (!route) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Route not found" });
        return;
      }

      const speed = Math.floor((route.distance / transit.travelTime) * 3.6);

      let speedLimit: number = SPEED_LIMIT_CAR_CLEAR;
      if (vehicle.type === "Car") {
        speedLimit =
          transit.weather === "Rainy"
            ? SPEED_LIMIT_CAR_RAINY
            : SPEED_LIMIT_CAR_CLEAR;
      } else if (vehicle.type === "Truck") {
        speedLimit =
          transit.weather === "Rainy"
            ? SPEED_LIMIT_TRUCK_RAINY
            : SPEED_LIMIT_TRUCK_CLEAR;
      }

      if (speed > speedLimit) {
        const infractionData = {
          vehicleId: transit.vehicleId,
          routeId: req.body.routeId,
          speed: speed,
          limit: speedLimit,
          weather: transit.weather,
          amount: FINE_AMOUNT,
          timestamp: new Date(),
        };

        const newInfraction = await InfractionRepository.create(infractionData);
        res
          .status(StatusCodes.CREATED)
          .json({ transit: transit, infraction: newInfraction });
        return;
      } else {
        res.status(StatusCodes.CREATED).json(transit);
        return;
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error creating transit" });
    }
  }

  async getTransit(req: Request, res: Response): Promise<void> {
    try {
      if (req.query.transitId) {
        const transitId = Number(req.query.transitId);

        if (isNaN(transitId)) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Invalid ID format" });
          return;
        }

        const transit = await TransitRepository.getById(transitId);
        if (transit) {
          res.status(StatusCodes.OK).json(transit);
          return;
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Transit not found" });
          return;
        }
      } else {
        const transits = await TransitRepository.getAll();
        res.status(StatusCodes.OK).json(transits);
        return;
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching transit(s)" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const transitId = Number(req.params.transitId);

      if (isNaN(transitId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid ID format" });
        return;
      }

      const { vehicleId, routeId, travelTime, weather } = req.body;
      if (isNaN(vehicleId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid vehicleId format" });
        return;
      }

      if (isNaN(routeId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid routeId format" });
        return;
      }

      if (isNaN(travelTime)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid routeId format" });
        return;
      }

      if (!checkWeather(weather, res)) {
        return;
      }

      const updated = await TransitRepository.update(transitId, req.body);

      if (updated) {
        res
          .status(StatusCodes.OK)
          .json({ message: "Transit updated successfully" });
        return;
      } else {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Transit not found" });
        return;
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error updating transit" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const transitId = Number(req.params.transitId);

      if (isNaN(transitId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid ID format" });
        return;
      }

      const deleted = await TransitRepository.delete(transitId);

      if (deleted) {
        res
          .status(StatusCodes.OK)
          .json({ message: "Transit deleted successfully" });
        return;
      } else {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Transit not found" });
        return;
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error deleting transit" });
    }
  }
}

export default new TransitController();
