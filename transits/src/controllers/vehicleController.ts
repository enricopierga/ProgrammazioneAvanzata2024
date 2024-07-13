// src/controllers/VehicleController.ts
import { Request, Response } from "express";
import VehicleRepository from "../repositories/VehicleRepository";
import UserRepository from "../repositories/UserRepository";

class VehicleController {
	async create(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.body;

			// Verifica se lo userId esiste nella tabella Users
			const user = await UserRepository.getById(userId);
			if (!user) {
			  res.status(400).json({ message: `User with ID ${userId} does not exist` });
			  return;
			}
	  
			const vehicle = await VehicleRepository.create(req.body);
			res.status(201).json(vehicle);
		} catch  {
			res.status(500).json({ message: "Error creating vehicle" });
		}
	}

	async getVehicle(req: Request, res: Response): Promise<void> {
		try {
			if (req.query.vehicleId) {
			  const vehicleId = Number(req.query.vehicleId);
	  
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
			} else {
			  const vehicles = await VehicleRepository.getAll();
			  res.status(200).json(vehicles);
			}
		} catch {
			  res.status(500).json({ message: "Error retrieving vehicle(s)" });
			}
	}

	async update(req: Request, res: Response): Promise<void> {
		try {
			const vehicleId = Number(req.params.vehicleId);
	  
			if (isNaN(vehicleId)) {
			  res.status(400).json({ message: "Invalid ID format" });
			  return;
			}

			const { userId } = req.body;
			const user = await UserRepository.getById(userId);
			if (!user) {
			  res.status(400).json({ message: `User with ID ${userId} does not exist` });
			  return;
			}
	  
			const updated = await VehicleRepository.update(vehicleId, req.body);
	  
			if (updated) {
			  res.status(200).json({ message: "Vehicle updated successfully" });
			} else {
			  res.status(404).json({ message: "Vehicle not found" });
			}
		} catch {
			  res.status(500).json({ message: "Error updating vehicle" });
		}
	}

	async delete(req: Request, res: Response): Promise<void> {
		const vehicleId = Number(req.params.vehicleId);

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
