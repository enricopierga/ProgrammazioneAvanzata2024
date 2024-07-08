// src/controllers/TransitController.ts
import { Request, Response } from "express";
import Transit from "../models/TransitModel";
import TransitRepository from "../repositories/TransitRepository";
import InfractionController from "./InfractionController";

class TransitController {
	//Funzione per determinare se creare una multa o no
	private shouldCreateInfraction(transit: Transit): boolean {
		const speedLimitRainy = 110; // Soglia di velocità con pioggia
		const speedLimitClear = 130; // Soglia di velocità senza pioggia
	
		return ((transit.weather === 'rainy' && transit.speed > speedLimitRainy) ||
		  (transit.weather === 'clear' && transit.speed > speedLimitClear));
	}
	
	// Creazione di un Transit e creazione automatica di un'Infraction
	// se vengono soddisfatte delle condizioni
	async create(req: Request, res: Response): Promise<void> {
	    const transit = await TransitRepository.create(req.body);
		res.status(201).json(transit);
	
		if (this.shouldCreateInfraction(transit)) {
			// Costruisce i dati per l'infrazione
		    const infractionData = {
			  vehicleId: transit.vehicleId,
			  routeId: req.body.routeId, 
			  speed: req.body.speed,
			  limit: transit.weather === 'rainy' ? 110 : 130,
			  weather: transit.weather,
			  amount: 150, // Importo fisso per la multa (a prescindere se è rainy o clear)
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
