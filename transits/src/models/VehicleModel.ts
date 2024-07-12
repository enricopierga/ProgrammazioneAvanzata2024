import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from './UserModel';

interface VehicleAttributes {
	id: number;
	licensePlate: string;
	type: "truck" | "car";
	userId: number;
}

interface VehicleCreationAttributes extends Optional<VehicleAttributes, "id"> {}

class Vehicle
	extends Model<VehicleAttributes, VehicleCreationAttributes>
	implements VehicleAttributes
{
	public id!: number;
	public licensePlate!: string;
	public type!: "truck" | "car";
	public userId!: number;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Vehicle.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		licensePlate: {
			type: new DataTypes.STRING(10),
			allowNull: false,
		},
		type: {
			type: DataTypes.ENUM("truck", "car"),
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
		},
	},
	{
		sequelize,
		modelName: "vehicle",
		tableName: "vehicles",
	}
);

export default Vehicle;
