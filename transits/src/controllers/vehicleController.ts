// src/controllers/VehicleController.ts
import { Request, Response } from "express";
import VehicleRepository from "../repositories/VehicleRepository";

class VehicleController {
	async create(req: Request, res: Response): Promise<void> {
		const vehicle = await VehicleRepository.create(req.body);
		res.status(201).json(vehicle);
	}

	async getAll(req: Request, res: Response): Promise<void> {
		const vehicles = await VehicleRepository.getAll();
		res.status(200).json(vehicles);
	}

	async getById(req: Request, res: Response): Promise<void> {
		const vehicleId = Number(req.params.id);

		if (isNaN(vehicleId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const vehicle = await VehicleRepository.getById(vehicleId);
		if (vehicle) {
			res.status(200).json(vehicle);
		} else {
			res.status(404).json({ message: "Vehicle not found" });
		}
	}

	async update(req: Request, res: Response): Promise<void> {
		const vehicleId = Number(req.params.id);

		if (isNaN(vehicleId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const updated = await VehicleRepository.update(vehicleId, req.body);
		if (updated) {
			res.status(200).json({ message: "Vehicle updated successfully" });
		} else {
			res.status(404).json({ message: "Vehicle not found" });
		}
	}

	async delete(req: Request, res: Response): Promise<void> {
		const vehicleId = Number(req.params.id);

		if (isNaN(vehicleId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const deleted = await VehicleRepository.delete(vehicleId);
		if (deleted) {
			res.status(200).json({ message: "Vehicle deleted successfully" });
		} else {
			res.status(404).json({ message: "Vehicle not found" });
		}
	}
}

export default new VehicleController();
