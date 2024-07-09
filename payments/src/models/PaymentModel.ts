import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './UserModel';  

interface PaymentAttributes {
  id: number;
  uuidPayment: string;
  amount: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id'> {}

// Definizione del modello Payment
class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public uuidPayment!: string;
  public amount!: number;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuidPayment: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {

  tableName: 'payments',
	modelName: 'payment',
    sequelize,
  }
);

Payment.belongsTo(User, { foreignKey: 'userId' });

export default Payment;
