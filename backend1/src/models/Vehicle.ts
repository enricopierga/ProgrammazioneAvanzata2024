// src/models/Vehicle.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface VehicleAttributes {
  id: number;
  licensePlate: string;
  type: string;
  owner: string;
}

interface VehicleCreationAttributes extends Optional<VehicleAttributes, 'id'> {}

class Vehicle extends Model<VehicleAttributes, VehicleCreationAttributes> implements VehicleAttributes {
  public id!: number;
  public licensePlate!: string;
  public type!: string;
  public owner!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vehicle.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'vehicles',
    sequelize,
  }
);

export default Vehicle;