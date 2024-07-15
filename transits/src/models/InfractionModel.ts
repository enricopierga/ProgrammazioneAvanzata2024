// src/models/Infraction.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Vehicle from "../models/VehicleModel";
import Route from "../models/RouteModel";
import User from "./UserModel";

interface InfractionAttributes {
	id: number;
	vehicleId: number;
	routeId: number;
	userId: number;
	speed: number;
	limit: number;
	weather: "rainy" | "clear";
	amount: number;
	timestamp: Date;
	uuid: string; //uuid generato in automatico ed associato alla multa
	paid: boolean;
}

interface InfractionCreationAttributes
	extends Optional<InfractionAttributes, "id"> { }

class Infraction
	extends Model<InfractionAttributes, InfractionCreationAttributes>
	implements InfractionAttributes {

	public id!: number;
	public vehicleId!: number;
	public routeId!: number;
	public userId!: number;
	public speed!: number;
	public limit!: number;
	public weather!: "rainy" | "clear";
	public amount!: number;
	public timestamp!: Date;
	public uuid!: string;
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
		
		userId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: User,
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
			type: DataTypes.ENUM("rainy", "clear"),
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
		uuid: {
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
