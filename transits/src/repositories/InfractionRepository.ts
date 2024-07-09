import Infraction from "../models/InfractionModel";
import { Op } from 'sequelize';
import Vehicle from '../models/VehicleModel';
import Route from '../models/RouteModel';
import Gate from '../models/GateModel';


class InfractionRepository {
	async create(data: any): Promise<Infraction> {
		return await Infraction.create(data);
	}

	async getInfractionsByPlatesAndPeriod(plates: string[], startDate: string, endDate: string, isOperator: boolean, userId: number): Promise<any> {
		const whereClause: any = {
		  plate: { [Op.in]: plates }, // equivale in SQL a WHERE plate IN ('plate1', 'plate2', 'plate3', ...)
		  timestamp: {[Op.between]: [new Date(startDate), new Date(endDate)],}, // equivale in SQL in WHERE timestamp BETWEEN '2024-01-01' AND '2024-12-31'
		};
	
		// Se l'utente non è un operatore, viene aggiunta una clausola alla condizione whereClause per filtrare i risultati in base allo userId.
		if (!isOperator) {
		  whereClause.userId = userId;
		}
	
		const infractions = await Infraction.findAll({
			where: whereClause,
			include: [
			  { 
				model: Vehicle, 
				as: 'vehicle', 
				attributes: ['licensePlate', 'type'] 
			  },
			  {
				model: Route,
				as: 'route',
				attributes: ['distance'],
				include: [
				  { model: Gate, as: 'startGate', attributes: ['location'] },
				  { model: Gate, as: 'endGate', attributes: ['location'] },
				],
			  },
			],
		  });
	
		/*
		return infractions.map(infraction => ({
			plate: infraction.vehicle.licensePlate,
			type: infraction.vehicle.type,
			route: {
			  inGate: infraction.route.startGate.location,
			  outGate: infraction.route.endGate.location,
			  distance: infraction.route.distance,
			},
			averageSpeed: infraction.speed,
			limitSpeed: infraction.limit,
			speedDelta: infraction.speed - infraction.limit,
			weather: infraction.weather,
		})) ;
		*/
	}

}

export default new InfractionRepository();
