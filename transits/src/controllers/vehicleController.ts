// src/controllers/VehicleController.ts
import { Request, Response } from "express";
import VehicleRepository from "../repositories/VehicleRepository";
import { checkLicensePlate, checkUserId, checkVehicleType } from "../middleware/Validation";

class VehicleController {

	async create(req: Request, res: Response): Promise<void> {
		try {
			const { licensePlate, type, userId } = req.body;

			if(!(await checkLicensePlate(licensePlate))){
				res.status(400).json({ message: "Invalid license plate format" });
                return;
			}

			if(!(await checkVehicleType(String(type)))){
				res.status(400).json({ message: 'Invalid vehicle type format, it be "car" or "truck"' });
				return;
			}

	        if(await checkUserId(res, userId)){
				const vehicle = await VehicleRepository.create(req.body);
			    res.status(201).json(vehicle);
				return;
			}			
		} catch  {
			res.status(500).json({ message: "Error creating vehicle" });
		}
	}
	checkVehicleType(type: any) {
		throw new Error("Method not implemented.");
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

            const { licensePlate, type, userId } = req.body;

			if(!(await checkLicensePlate(licensePlate))){
				res.status(400).json({ message: "Invalid license plate format" });
                return;
			}


			if(!(await checkVehicleType(type))){
				res.status(400).json({ message: "Invalid vehicle type format, it must be car or truck" });
				return;
			}
			console.log("Vaffanculo 1");

			if(await checkUserId(res, userId)){
				const updated = await VehicleRepository.update(vehicleId, req.body);
				console.log("Vaffanculo 2");
	  
                if (updated) {
			        res.status(200).json({ message: "Vehicle updated successfully" });
			    } else {
			        res.status(404).json({ message: "Vehicle not found" });
			    }
			}		
		} catch {
			  res.status(500).json({ message: "Error updating vehicle" });
		}
	}

	async delete(req: Request, res: Response): Promise<void> {
		try {
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
		} catch (err) {
			const error = err as Error;
			if (error.message.includes('Cannot delete vehicle')) {
			  res.status(400).json({ message: error.message });
			} else {
			  res.status(500).json({ message: "Error deleting vehicle"});
		    }
	    }
    }
}

export default new VehicleController();
