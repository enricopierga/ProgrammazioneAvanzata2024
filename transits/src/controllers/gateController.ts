import { Request, Response } from "express";
import GateRepository from "../repositories/GateRepository";
import { StatusCodes } from "http-status-codes";

class GateController {
  /**
   * Creates a new gate.
   * Expects a request body containing the gate details.
   * Responds with the created gate or an error message.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const gate = await GateRepository.create(req.body);
      res.status(StatusCodes.CREATED).json(gate);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error creating gate" });
    }
  }

  /**
   * Retrieves a specific gate by ID or all gates if no ID is provided.
   * If a gateId query parameter is provided, fetches the gate with that ID.
   * If no gateId is provided, fetches all gates.
   * Responds with the gate(s) or an error message.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async getGate(req: Request, res: Response): Promise<void> {
    try {
      if (req.query.gateId) {
        const gateId = Number(req.query.gateId);
        if (isNaN(gateId)) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Invalid ID format" });
          return;
        }

        const gate = await GateRepository.getById(gateId);

        if (gate) {
          res.status(StatusCodes.OK).json(gate);
          return;
        }

        res.status(StatusCodes.NOT_FOUND).json({ message: "Gate not found" });
      } else {
        const gates = await GateRepository.getAll();
        res.status(StatusCodes.OK).json(gates);
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching gates" });
    }
  }

  /**
   * Updates an existing gate by ID.
   * Expects a gateId parameter in the URL and the updated gate details in the request body.
   * Responds with a success message or an error message.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const gateId = Number(req.params.gateId);

      if (isNaN(gateId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid ID format" });
        return;
      }

      const updated = await GateRepository.update(gateId, req.body);

      if (updated) {
        res
          .status(StatusCodes.OK)
          .json({ message: "Gate updated successfully" });
        return;
      }

      res.status(StatusCodes.NOT_FOUND).json({ message: "Gate not found" });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error updating gate" });
    }
  }

  /**
   * Deletes a gate by ID.
   * Expects a gateId parameter in the URL.
   * Responds with a success message or an error message.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const gateId = Number(req.params.gateId);

      if (isNaN(gateId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid ID format" });
        return;
      }

      const deleted = await GateRepository.delete(gateId);

      if (deleted) {
        res
          .status(StatusCodes.OK)
          .json({ message: "Gate deleted successfully" });
        return;
      }

      res.status(StatusCodes.NOT_FOUND).json({ message: "Gate not found" });
    } catch (err) {
      const error = err as Error;
      if (error.message.includes("Cannot delete gate")) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Error deleting gate", error: error.message });
      }
    }
  }
}

export default new GateController();
