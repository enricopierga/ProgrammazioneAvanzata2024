import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

// Definizione del modello Utente
class Utente extends Model {
	public id!: number;
	public nome!: string;
	public credito!: number;
}

Utente.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		nome: {
			type: new DataTypes.STRING(128),
			allowNull: false,
		},
		credito: {
			type: DataTypes.FLOAT,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{
		tableName: "utenti",
		sequelize,
	}
);

export default Utente;
