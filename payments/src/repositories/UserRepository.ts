import { where } from "sequelize";
import User from "../models/UserModel";

class UserRepository {

	public async getByCredentials(username: string, password: string): Promise<User | null> {
		return await User.findOne({ where: { username: username, password: password } })
	}

	public async getById(utenteId: number): Promise<User | null> {
		return User.findByPk(utenteId);
	}

	public async increaseCredit(
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

	public async decreaseCredit(userId: number, amount: number): Promise<User | null> {
		try {
			// Trova l'utente per ID
			const user = await User.findByPk(userId);

			if (!user) {
				throw new Error('User not found');
			}

			// Aggiorna il credito
			user.credit -= amount;
			await user.save();

			return user;
		} catch (error) {
			console.error('Error updating user credit:', error);
			throw error;
		}




	}

}


export default new UserRepository();
