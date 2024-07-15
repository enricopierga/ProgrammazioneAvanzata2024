import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface VehicleAttributes {
  id: number;
  licensePlate: string;
  type: "Truck" | "Car";
  userId: number;
}

interface VehicleCreationAttributes extends Optional<VehicleAttributes, "id"> {}

class Vehicle
  extends Model<VehicleAttributes, VehicleCreationAttributes>
  implements VehicleAttributes
{
  public id!: number;
  public licensePlate!: string;
  public type!: "Truck" | "Car";
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
      type: DataTypes.ENUM("Truck", "Car"),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "vehicle",
    tableName: "vehicles",
  }
);

export default Vehicle;
