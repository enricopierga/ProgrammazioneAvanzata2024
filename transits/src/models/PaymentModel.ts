import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./UserModel";

interface PaymentAttributes {
	id: number;
	uuidPagamento: string;
	importo: number;
	utenteId: number;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, "id"> {}

// Definizione del modello Pagamento
class Payment
	extends Model<PaymentAttributes, PaymentCreationAttributes>
	implements PaymentAttributes
{
	public id!: number;
	public uuidPagamento!: string;
	public importo!: number;
	public utenteId!: number;

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
		uuidPagamento: {
			type: new DataTypes.STRING(128),
			allowNull: false,
		},
		importo: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		utenteId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		tableName: "payments",
		modelName: "payment",
		sequelize,
	}
);

export default Payment;
