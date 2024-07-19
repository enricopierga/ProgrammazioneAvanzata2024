import { Request, Response } from "express";
import RouteRepository from "../repositories/RouteRepository";
import { checkGatesIds } from "../middleware/Validation";
import { StatusCodes } from "http-status-codes";

class RouteController {
  /**
   * Creates a new route.
   * Expects a request body containing 'startGateId', 'endGateId', and 'distance'.
   * Responds with the created route or an error message.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { startGateId, endGateId, distance } = req.body;
      if (isNaN(distance)) {
        res
          .status(StatusCodes.BAD_GATEWAY)
          .json({ message: "Invalid distance format" });
        return;
      }

      if (await checkGatesIds(res, Number(startGateId), Number(endGateId))) {
        const route = await RouteRepository.create(req.body);
        res.status(StatusCodes.CREATED).json(route);
        return;
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error creating route" });
    }
  }

  /**
   * Retrieves a route or all routes.
   * If 'routeId' query parameter is provided, it retrieves the specific route.
   * Otherwise, it retrieves all routes.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async getRoute(req: Request, res: Response): Promise<void> {
    try {
      if (req.query.routeId) {
        const routeId = Number(req.query.routeId);

        if (isNaN(routeId)) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Invalid ID format" });
          return;
        }

        const route = await RouteRepository.getById(routeId);

        if (route) {
          res.status(StatusCodes.OK).json(route);
          return;
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Route not found" });
          return;
        }
      } else {
        const routes = await RouteRepository.getAll();
        res.status(StatusCodes.OK).json(routes);
        return;
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching route(s)" });
    }
  }

  /**
   * Updates a route.
   * Expects 'routeId' as a URL parameter and updates the fields provided in the request body.
   * Responds with a success or error message.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const routeId = Number(req.params.routeId);

      if (isNaN(routeId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid ID format" });
        return;
      }

      const { startGateId, endGateId, distance } = req.body;

      // Check if the start and end gates exist
      if (await checkGatesIds(res, startGateId, endGateId)) {
        if (isNaN(distance)) {
          res
            .status(StatusCodes.BAD_GATEWAY)
            .json({ message: "Invalid distance format" });
          return;
        }

        const updated = await RouteRepository.update(routeId, req.body);

        if (updated) {
          res
            .status(StatusCodes.OK)
            .json({ message: "Route updated successfully" });
          return;
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Route not found" });
          return;
        }
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error updating route" });
    }
  }

  /**
   * Deletes a route.
   * Expects 'routeId' as a URL parameter.
   * Responds with a success or error message.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const routeId = Number(req.params.routeId);

      if (isNaN(routeId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid ID format" });
        return;
      }

      const deleted = await RouteRepository.delete(routeId);

      if (deleted) {
        res
          .status(StatusCodes.OK)
          .json({ message: "Route deleted successfully" });
        return;
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Route not found" });
        return;
      }
    } catch (err) {
      const error = err as Error;
      if (error.message.includes("Cannot delete route")) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Error deleting route" });
      }
    }
  }
}

export default new RouteController();
