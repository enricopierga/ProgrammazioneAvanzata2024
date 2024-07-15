// src/controllers/TransitController.ts
import { Request, Response } from "express";
import TransitRepository from "../repositories/TransitRepository";
import VehicleRepository from "../repositories/VehicleRepository";
import RouteRepository from "../repositories/RouteRepository";
import InfractionRepository from "../repositories/InfractionRepository";
import {
	SPEED_LIMIT_CAR_CLEAR,
	SPEED_LIMIT_CAR_RAINY,
	SPEED_LIMIT_TRUCK_CLEAR,
	SPEED_LIMIT_TRUCK_RAINY,
	FINE_AMOUNT
  } from "../config/constants";

class TransitController {

	// Creazione di un Transit e creazione automatica di un'Infraction
	// se vengono soddisfatte delle condizioni

	async create(req: Request, res: Response): Promise<void> {
		const {vehicleId, routeId, travelTime, weather} = req.body;
		if (isNaN(vehicleId)){
			res.status(400).json({ message: "Invalid vehicleId format" });
			return;
		}

		if (isNaN(routeId)){
			res.status(400).json({ message: "Invalid routeId format" });
			return;
		}

		if (isNaN(travelTime)){
			res.status(400).json({ message: "Invalid routeId format" });
			return;
		}

		if (!(weather === ("clear" || "rainy"))){
			res.status(400).json({ message: 'Invalid weather, it must be "clear" or "rainy"' });
			return;
		}
		
		const transit = await TransitRepository.create(req.body); // crea il transito
		const vehicle = await VehicleRepository.getById(vehicleId)
		const route = await RouteRepository.getById(routeId);

		if (!vehicle) {
			res.status(404).json({ message: 'Vehicle not found' });
			return;
		}

		if (!route) {
			res.status(404).json({ message: 'Route not found' });
			return;
		}

		const speed = Math.floor((route.distance / transit.travelTime) * 3.6); // Calcola la velocità in km/h

		let speedLimit: number = SPEED_LIMIT_CAR_CLEAR;
        if (vehicle.type === "car") {
            speedLimit = transit.weather === "rainy" ? SPEED_LIMIT_CAR_RAINY : SPEED_LIMIT_CAR_CLEAR;
        } else if (vehicle.type === "truck") {
            speedLimit = transit.weather === "rainy" ? SPEED_LIMIT_TRUCK_RAINY : SPEED_LIMIT_TRUCK_CLEAR;
        }

		if (speed > speedLimit) {
			const infractionData = {
				vehicleId: transit.vehicleId,
				routeId: req.body.routeId,
				speed: speed,
				limit: speedLimit,
				weather: transit.weather,
				amount: FINE_AMOUNT, // Importo fisso per la multa (a prescindere dal meteo e dal tipo di veicolo)
				timestamp: new Date(),
			};

			const newInfraction = await InfractionRepository.create(infractionData);
			res.status(201).json({ transit: transit, infraction: newInfraction });
			return;
		} else {
			res.status(201).json(transit);
		}
	}

	async getTransit(req: Request, res: Response): Promise<void> {

		if (req.query.transitId) {
			const transitId = Number(req.query.transitId);

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

		else {
			const transits = await TransitRepository.getAll();
			res.status(200).json(transits);
		}

	}

	async update(req: Request, res: Response): Promise<void> {
		const transitId = Number(req.params.transitId);

		if (isNaN(transitId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const {vehicleId, routeId, travelTime, weather} = req.body;
		if (isNaN(vehicleId)){
			res.status(400).json({ message: "Invalid vehicleId format" });
			return;
		}

		if (isNaN(routeId)){
			res.status(400).json({ message: "Invalid routeId format" });
			return;
		}

		if (isNaN(travelTime)){
			res.status(400).json({ message: "Invalid routeId format" });
			return;
		}

		if (!(weather === ("clear" || "rainy"))){
			res.status(400).json({ message: 'Invalid weather, it must be "clear" or "rainy"' });
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
		const transitId = Number(req.params.transitId);

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
