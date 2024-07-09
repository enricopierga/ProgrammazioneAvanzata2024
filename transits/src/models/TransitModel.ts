import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Vehicle from "./VehicleModel";
import Route from "./RouteModel";

interface TransitAttributes {
	id: number;
	vehicleId: number;
	routeId: number;
	travelTime: number; // Tempo in secondi per percorrere la rotta
	weather: "rainy" | "clear";
}

interface TransitCreationAttributes extends Optional<TransitAttributes, "id"> {}

class Transit
	extends Model<TransitAttributes, TransitCreationAttributes>
	implements TransitAttributes
{
	public id!: number;
	public vehicleId!: number;
	public routeId!: number;
	public travelTime!: number; // Tempo in secondi per percorrere la rotta
	public weather!: "rainy" | "clear";

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
		routeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Route,
				key: "id",
			},
		},
		travelTime: {
			type: DataTypes.INTEGER, 
			allowNull: false,
		},
		weather: {
			type: DataTypes.ENUM("rainy", "clear"), 
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
