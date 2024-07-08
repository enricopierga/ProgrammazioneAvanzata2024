import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface UserAttributes {
	id: number;
	username: string;
	password: string;
	email: string;
	credit: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
	extends Model<UserAttributes, UserCreationAttributes>
	implements UserAttributes
{
	public id!: number;
	public username!: string;
	public password!: string;
	public email!: string;
	public credit!: number;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		username: {
			type: new DataTypes.STRING(128),
			allowNull: false,
		},
		password: {
			type: new DataTypes.STRING(128),
			allowNull: false,
		},
		email: {
			type: new DataTypes.STRING(128),
			allowNull: true,
		},
		credit: {
			type: DataTypes.FLOAT,
			allowNull: true,
			defaultValue: 0,
		},
	},
	{
		tableName: "users",
		modelName: "user",
		sequelize,
	}
);

export default User;