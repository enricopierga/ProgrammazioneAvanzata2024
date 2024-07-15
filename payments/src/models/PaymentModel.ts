import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './UserModel';


export enum paymentTypes {
  addBalance = "addBalance",
  finePayment = "finePayment"
}

interface PaymentAttributes {
  id: number;
  amount: number;
  paymentType: paymentTypes;
  userId: number;
  fineId: number;
  createdAt?: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id'> { }

// Definizione del modello Payment
class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public amount!: number;
  public fineId!: number;
  public userId!: number;
  public paymentType!: paymentTypes;
  public readonly createdAt!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentType: {
      type: DataTypes.ENUM,
      values: Object.values(paymentTypes),
      allowNull: false,
    },
    fineId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    createdAt: {
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
