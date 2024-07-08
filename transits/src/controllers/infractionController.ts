// src/controllers/InfractionController.ts
import { Request, Response } from "express";
import InfractionRepository from "../repositories/InfractionRepository";

class InfractionController {
	async create(req: Request, res: Response): Promise<void> {
		const infraction = await InfractionRepository.create(req.body);
		res.status(201).json(infraction);
	}

	async getAll(req: Request, res: Response): Promise<void> {
		const infractions = await InfractionRepository.getAll();
		res.status(200).json(infractions);
	}

	async getById(req: Request, res: Response): Promise<void> {
		const infractionId = Number(req.params.id);

		if (isNaN(infractionId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const infraction = await InfractionRepository.getById(infractionId);
		if (infraction) {
			res.status(200).json(infraction);
		} else {
			res.status(404).json({ message: "Infraction not found" });
		}
	}

	async update(req: Request, res: Response): Promise<void> {
		const infractionId = Number(req.params.id);

		if (isNaN(infractionId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const updated = await InfractionRepository.update(
			infractionId,
			req.body
		);

		if (updated) {
			res.status(200).json({
				message: "Infraction updated successfully",
			});
		} else {
			res.status(404).json({ message: "Infraction not found" });
		}
	}

	async delete(req: Request, res: Response): Promise<void> {
		const infractionId = Number(req.params.id);

		if (isNaN(infractionId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const deleted = await InfractionRepository.delete(infractionId);

		if (deleted) {
			res.status(200).json({
				message: "Infraction deleted successfully",
			});
		} else {
			res.status(404).json({ message: "Infraction not found" });
		}
	}

	async getByVehicleAndPeriod(req: Request, res: Response): Promise<void> {
		// TODO: Need to be implemented

		res.status(200).json({ message: "Not implemented yet" });

		// const { vehicleId, startDate, endDate } = req.query;
		// const infractions = await InfractionRepository.getByVehicleAndPeriod(
		// 	Number(vehicleId),
		// 	new Date(startDate as string),
		// 	new Date(endDate as string)
		// );
		// res.status(200).json(infractions);
	}
}

export default new InfractionController();
