// src/controllers/GateController.ts
import { Request, Response } from "express";
import GateRepository from "../repositories/GateRepository";

class GateController {
	async create(req: Request, res: Response): Promise<void> {
		const gate = await GateRepository.create(req.body);
		res.status(201).json(gate);
	}

	async getAll(req: Request, res: Response): Promise<void> {
		const gates = await GateRepository.getAll();
		res.status(200).json(gates);
	}

	async getById(req: Request, res: Response): Promise<void> {
		const gateId = Number(req.params.id);

		if (isNaN(gateId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const gate = await GateRepository.getById(gateId);

		if (gate) {
			res.status(200).json(gate);
			return;
		}

		res.status(404).json({ message: "Gate not found" });
	}

	async update(req: Request, res: Response): Promise<void> {
		const gateId = Number(req.params.id);

		if (isNaN(gateId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const updated = await GateRepository.update(gateId, req.body);

		if (updated) {
			res.status(200).json({ message: "Gate updated successfully" });
			return;
		}

		res.status(404).json({ message: "Gate not found" });
	}

	async delete(req: Request, res: Response): Promise<void> {
		const gateId = Number(req.params.id);

		if (isNaN(gateId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const deleted = await GateRepository.delete(gateId);

		if (deleted) {
			res.status(200).json({ message: "Gate deleted successfully" });
			return;
		}

		res.status(404).json({ message: "Gate not found" });
	}
}

export default new GateController();
