// src/controllers/TransitController.ts
import { Request, Response } from "express";
import Transit from "../models/TransitModel";
import TransitRepository from "../repositories/TransitRepository";
import VehicleRepository from "../repositories/VehicleRepository";
import RouteRepository from "../repositories/RouteRepository";
import InfractionController from "./InfractionController";
import Vehicle from "../models/VehicleModel";


class TransitController {
	//Funzione per determinare la velocità limite a seconda del meteo e del tipo di veicolo
	private getSpeedLimit(transit: Transit, vehicle: Vehicle): number {
		const speedLimitRainyCar = 110; // Soglia di velocità con pioggia in macchina
		const speedLimitClearCar = 130; // Soglia di velocità senza pioggia in macchina
		const speedLimitRainyTruck = 80; // Soglia di velocità con pioggia in camion
		const speedLimitClearTruck = 100; // Soglia di velocità senza pioggia in camion
	
		if (vehicle.type === 'car') {
			return transit.weather === 'rainy' ? speedLimitRainyCar : speedLimitClearCar;
		  }
	  
		if (vehicle.type === 'truck') {
			return transit.weather === 'rainy' ? speedLimitRainyTruck : speedLimitClearTruck;
		  }
	  
		return 0;
	}
	
	// Creazione di un Transit e creazione automatica di un'Infraction
	// se vengono soddisfatte delle condizioni
	async create(req: Request, res: Response): Promise<void> {
	    const transit = await TransitRepository.create(req.body); // crea il transito
		res.status(201).json(transit);
		
		const vehicle = await VehicleRepository.getById(transit.vehicleId)
		const route = await RouteRepository.getById(transit.routeId);

		if (!vehicle) {
			res.status(404).json({ message: 'Vehicle not found' });
			return;
		  }

		if (!route) {
			res.status(404).json({ message: 'Route not found' });
			return;
		  }
		
		const speed = (route.distance / transit.travelTime)*3.6; // Calcola la velocità in km/h
	    const speedLimit = this.getSpeedLimit(transit, vehicle);
	
		if (speed > speedLimit) {
			// Costruisce i dati per l'infrazione
		    const infractionData = {
			  vehicleId: transit.vehicleId,
			  routeId: req.body.routeId, 
			  speed: speed,
			  limit: speedLimit,
			  weather: transit.weather,
			  amount: 150, // Importo fisso per la multa (a prescindere dal meteo e dal tipo di veicolo)
			  timestamp: new Date(),
			};

			await InfractionController.create({ body: infractionData } as Request, res);
		}

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
