import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Vehicle from "./VehicleModel";
import Gate from "./GateModel";

interface TransitAttributes {
	id: number;
	vehicleId: number;
	gateId: number;
	timestamp: Date;
	weather: string;
}

interface TransitCreationAttributes extends Optional<TransitAttributes, "id"> {}

class Transit
	extends Model<TransitAttributes, TransitCreationAttributes>
	implements TransitAttributes
{
	public id!: number;
	public vehicleId!: number;
	public gateId!: number;
	public timestamp!: Date;
	public weather!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Transit.init(
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
		gateId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Gate,
				key: "id",
			},
		},
		timestamp: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		weather: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		tableName: "transits",
		modelName: "transit",
		sequelize,
	}
);

export default Transit;
