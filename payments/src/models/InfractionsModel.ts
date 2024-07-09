// src/models/Infraction.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Vehicle from "./VehicleModel";
import Route from "./RouteModel";

interface InfractionAttributes {
	id: number;
	vehicleId: number;
	routeId: number;
	speed: number;
	limit: number;
	weather: string;
	amount: number;
	fineId: string;
	timestamp: Date;
	paid: boolean;
}

interface InfractionCreationAttributes
	extends Optional<InfractionAttributes, "id"> {}

class Infraction
	extends Model<InfractionAttributes, InfractionCreationAttributes>
	implements InfractionAttributes
{
	public id!: number;
	public vehicleId!: number;
	public routeId!: number;
	public speed!: number;
	public limit!: number;
	public weather!: string;
	public amount!: number;
	public fineId!: string;
	public timestamp!: Date;
	public paid!: boolean;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Infraction.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		vehicleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Vehicle,
				key: "id",
			},
		},
		routeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Route,
				key: "id",
			},
		},
		speed: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		limit: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		weather: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		amount: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		timestamp: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		fineId: {
			type: DataTypes.STRING(128),
			allowNull: false,
			unique: true,
		},

		paid: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		tableName: "infractions",
		modelName: "infraction",
		sequelize,
	}
);

export default Infraction;
