import { Op } from 'sequelize';
import Infraction from "../models/InfractionModel";
import Vehicle from '../models/VehicleModel';
import Route from '../models/RouteModel';
import Gate from '../models/GateModel';
import {v4 as UUIDV4} from 'uuid';


class InfractionRepository {
	async create(data: any): Promise<Infraction> {
		data.uuid = UUIDV4();
		return await Infraction.create(data);
	}

	async getInfractionsByUserId(userId: number): Promise<Infraction[]> {
		return await Infraction.findAll({
			where: { userId: userId }
		});

	}

	async getByPlatesAndPeriod(plates: string[], startDate: string, endDate: string, isOperator: boolean, userId: number): Promise<any> {
		const whereClause: any = {timestamp: {[Op.between]: [new Date(startDate), new Date(endDate)]}}; // = WHERE timestamp BETWEEN '2024-01-01' AND '2024-12-31'
		
		if (!isOperator) {
		  whereClause.userId = userId;
		}
		
		const infractions = await Infraction.findAll({
			where: whereClause,
			include: [
			  { 
				model: Vehicle, 
				as: 'vehicle', 
				attributes: ['licensePlate', 'type'],
				where: {licensePlate: { [Op.in]: plates }}
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
			datetime: infraction.timestamp
		}));
	}

	async getById(id: number): Promise<Infraction | null> {
		return await Infraction.findByPk(id);
	}

	async getByUuid(uuid: string): Promise<Infraction | null> {
        return await Infraction.findOne({ where: { uuid } });
    }
}

export default new InfractionRepository();
