// src/controllers/TransitController.ts
import { Request, Response } from "express";
import Transit from "../models/TransitModel";
import TransitRepository from "../repositories/TransitRepository";
import VehicleRepository from "../repositories/VehicleRepository";
import RouteRepository from "../repositories/RouteRepository";
import InfractionController from "./infractionController";
import Vehicle from "../models/VehicleModel";


class TransitController {
	//Funzione per determinare la velocità limite a seconda del meteo e del tipo di veicolo
	private getSpeedLimit(transit: Transit, vehicle: Vehicle): number {
		const speedLimitRainyCar = 110; // Soglia di velocità con pioggia in macchina
		const speedLimitClearCar = 130; // Soglia di velocità senza pioggia in macchina
		const speedLimitRainyTruck = 80; // Soglia di velocità con pioggia in camion
		const speedLimitClearTruck = 100; // Soglia di velocità senza pioggia in camion
	
		if (vehicle.type === 'car') {
			return Number(transit.weather === 'rainy' ? speedLimitRainyCar : speedLimitClearCar);
			
		  }
	  
		if (vehicle.type === 'truck') {
			return Number(transit.weather === 'rainy' ? speedLimitRainyTruck : speedLimitClearTruck);		
		  }
		
		return 0;
	}

	
	
	// Creazione di un Transit e creazione automatica di un'Infraction
	// se vengono soddisfatte delle condizioni
	async create(req: Request, res: Response): Promise<void> {
		//try  {
	        const transit = await TransitRepository.create(req.body); // crea il transito
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
		
		    const speed = Math.floor((route.distance / transit.travelTime)*3.6); // Calcola la velocità in km/h
			console.log(`La velocità del veicolo è ${speed} km/h`);

	        let speedLimit: number = 130;
            if (vehicle.type === 'car') {
               speedLimit = transit.weather === 'rainy' ? 110 : 130;
            } else if (vehicle.type === 'truck') {
               speedLimit = transit.weather === 'rainy' ? 80 : 100;
            }

			console.log(`La velocità limite è ${speedLimit} km/h`);
	 
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

				console.log(`Sei in multa per ${speed - speedLimit} km/h`);

			    await InfractionController.create({ body: infractionData } as Request, res);			
		    } else {
				res.status(201).json(transit);
			}

	   // } catch(error) {
		//	res.status(500).json({ error: "Fuck you" });
		
	}

	async getTransit(req: Request, res: Response): Promise<void> {

		if(req.query.transitId){
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
