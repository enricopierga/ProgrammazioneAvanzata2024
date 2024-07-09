// config/database.ts
import { Sequelize } from "sequelize";
import Gate from '../models/GateModel';
import Route from '../models/RouteModel';
import Vehicle from '../models/VehicleModel';
import Infraction from '../models/InfractionModel';
import User from '../models/UserModel';
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
	process.env.DB_NAME!,
	process.env.DB_USER!,
	process.env.DB_PASS!,
	{
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		dialect: "postgres",
		logging: false,
	}
);

export default sequelize;
