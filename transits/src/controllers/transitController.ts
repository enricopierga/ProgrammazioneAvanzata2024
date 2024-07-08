// src/controllers/TransitController.ts
import { Request, Response } from "express";
import TransitRepository from "../repositories/TransitRepository";

class TransitController {
	async create(req: Request, res: Response): Promise<void> {
		const transit = await TransitRepository.create(req.body);
		res.status(201).json(transit);
	}

	async getAll(req: Request, res: Response): Promise<void> {
		const transits = await TransitRepository.getAll();
		res.status(200).json(transits);
	}

	async getById(req: Request, res: Response): Promise<void> {
		const transitId = Number(req.params.id);

		if (isNaN(transitId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const transit = await TransitRepository.getById(transitId);
		if (transit) {
			res.status(200).json(transit);
		} else {
			res.status(404).json({ message: "Transit not found" });
		}
	}

	async update(req: Request, res: Response): Promise<void> {
		const transitId = Number(req.params.id);

		if (isNaN(transitId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const updated = await TransitRepository.update(transitId, req.body);
		if (updated) {
			res.status(200).json({ message: "Transit updated successfully" });
		} else {
			res.status(404).json({ message: "Transit not found" });
		}
	}

	async delete(req: Request, res: Response): Promise<void> {
		const transitId = Number(req.params.id);

		if (isNaN(transitId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const deleted = await TransitRepository.delete(transitId);

		if (deleted) {
			res.status(200).json({ message: "Transit deleted successfully" });
		} else {
			res.status(404).json({ message: "Transit not found" });
		}
	}
}

export default new TransitController();
