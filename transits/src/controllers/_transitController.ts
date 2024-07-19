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
import { checkLicensePlate, checkWeather } from "../middleware/Validation";

class TransitController {
  /**
   * Creates a new transit.
   * Expects a request body containing 'licensePlate', 'routeId', 'travelTime', and 'weather'.
   * Responds with the created transit and possibly a new infraction if the speed limit is exceeded.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { licensePlate, routeId, travelTime, weather } = req.body;

      // Validate license plate format
      if (!checkLicensePlate(licensePlate, res)) {
        return;
      }

      // Validate routeId and travelTime are numbers
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

      // Validate weather format
      if (!checkWeather(weather, res)) {
        return;
      }

      // Retrieve the vehicle using license plate
      const vehicle = await VehicleRepository.getByLicensePlate(licensePlate);

      if (!vehicle) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Vehicle not found" });
        return;
      }

      // Retrieve the route using routeId
      const route = await RouteRepository.getById(routeId);

      if (!route) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Route not found" });
        return;
      }

      // Set vehicleId in the request body
      req.body.vehicleId = vehicle.id;

      // Create the transit
      const transit = await TransitRepository.create(req.body);

      // Calculate the speed of the vehicle
      const speed = Math.floor((route.distance / transit.travelTime) * 3.6);

      // Determine the speed limit based on vehicle type and weather conditions
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

      // If the speed exceeds the speed limit, create an infraction
      if (speed > speedLimit) {
        const infractionData = {
          vehicleId: transit.vehicleId,
          routeId: req.body.routeId,
          userId: vehicle.userId,
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

  /**
   * Retrieves a transit or all transits.
   * If 'transitId' query parameter is provided, it retrieves the specific transit.
   * Otherwise, it retrieves all transits.
   * @param req - Express request object.
   * @param res - Express response object.
   */
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

  /**
   * Updates a transit.
   * Expects 'transitId' as a URL parameter and updates the fields provided in the request body.
   * Responds with a success or error message.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const transitId = Number(req.params.transitId);

      if (isNaN(transitId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid ID format" });
        return;
      }

      const { licensePlate, routeId, travelTime, weather } = req.body;

      // Validate and process licensePlate if provided
      if (licensePlate && !checkLicensePlate(licensePlate, res)) {
        return;
      } else if (licensePlate) {
        const vehicle = await VehicleRepository.getByLicensePlate(licensePlate);

        if (!vehicle) {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Vehicle not found" });
          return;
        }

        req.body.vehicleId = vehicle.id;
      }

      // Validate and process routeId if provided
      if (routeId && isNaN(routeId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid routeId format" });
        return;
      } else if (routeId) {
        const route = await RouteRepository.getById(routeId);

        if (!route) {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Route not found" });
          return;
        }
      }

      // Validate travelTime if provided
      if (travelTime && isNaN(travelTime)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid routeId format" });
        return;
      }

      // Validate weather if provided
      if (weather && !checkWeather(weather, res)) {
        return;
      }

      // Update the transit entry in the database
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

  /**
   * Deletes a transit.
   * Expects 'transitId' as a URL parameter.
   * Responds with a success or error message.
   * @param req - Express request object.
   * @param res - Express response object.
   */
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
