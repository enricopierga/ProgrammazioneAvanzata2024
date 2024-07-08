import User from "../models/UserModel";

class UtenteRepository {
	public async getById(utenteId: number): Promise<User | null> {
		return User.findByPk(utenteId);
	}

	public async addCredit(
		utenteId: number,
		importo: number
	): Promise<User | null> {
		const utente = await this.getById(utenteId);

		if (utente) {
			utente.credit += importo;
			await utente.save();
		}

		return utente;
	}

	public async getCredit(utenteId: number): Promise<number | null> {
		const utente = await this.getById(utenteId);

		return utente ? utente.credit : null;
	}
}

export default new UtenteRepository();
