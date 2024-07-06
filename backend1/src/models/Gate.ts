// src/models/Gate.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface GateAttributes {
  id: number;
  location: string;
  description: string;
}

interface GateCreationAttributes extends Optional<GateAttributes, 'id'> {}

class Gate extends Model<GateAttributes, GateCreationAttributes> implements GateAttributes {
  public id!: number;
  public location!: string;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Gate.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'gates',
    sequelize,
  }
);

export default Gate;