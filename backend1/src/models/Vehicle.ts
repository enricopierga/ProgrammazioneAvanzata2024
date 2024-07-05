
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Vehicle extends Model {
  public id!: number;
  public licensePlate!: string;
  public type!: string;
}

Vehicle.init(
  {
    id: {
      type: DataTypes.INTEGER,
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
  },
  {
    sequelize,
    tableName: 'vehicles',
  }
);

export default Vehicle;
