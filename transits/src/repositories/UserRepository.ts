import { where } from "sequelize";
import User from "../models/UserModel";

class UserRepository {

	public async getByCredentials(username: string, password: string): Promise<User | null> {
		return await User.findOne({where: {username: username, password: password}})
	}

	public async getById(utenteId: number): Promise<User | null> {
		return User.findByPk(utenteId);
	}

	public async addCredit(
		userId: number,
		importo: number
	): Promise<User | null> {
		const user = await this.getById(userId);

		if (user) {
			user.credit += importo;
			await user.save();
		}

		return user;
	}

	public async getCredit(utenteId: number): Promise<number | null> {
		const utente = await this.getById(utenteId);

		return utente ? utente.credit : null;
	}
}

export default new UserRepository();