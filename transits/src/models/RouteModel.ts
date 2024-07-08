// src/models/Route.ts
import { DataTypes, Model, Optional } from "sequelize";
import Gate from "./GateModel";
import sequelize from "../config/database";

interface RouteAttributes {
	id: number;
	startGateId: number;
	endGateId: number;
	distance: number;
}

interface RouteCreationAttributes extends Optional<RouteAttributes, "id"> {}

class Route
	extends Model<RouteAttributes, RouteCreationAttributes>
	implements RouteAttributes
{
	public id!: number;
	public startGateId!: number;
	public endGateId!: number;
	public distance!: number;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Route.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		startGateId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Gate,
				key: "id",
			},
		},
		endGateId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Gate,
				key: "id",
			},
		},
		distance: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
	},
	{
		tableName: "routes",
		modelName: "route",
		sequelize,
	}
);

export default Route;
