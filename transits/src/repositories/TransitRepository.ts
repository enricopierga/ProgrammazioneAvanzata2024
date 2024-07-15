import Transit from "../models/TransitModel";

class TransitRepository {
	//operatore OR varco
	async create(data: any): Promise<Transit> {
		return await Transit.create(data);
	}

	//solo operatore
	async getAll(): Promise<Transit[]> {
		return await Transit.findAll();
	}

	//solo operatore
	async getById(id: number): Promise<Transit | null> {
		return await Transit.findByPk(id);
	}

	//solo operatore
	async update(id: number, data: any): Promise<number> {
		const [updated] = await Transit.update(data, {
			where: { id },
		});
		return updated;
	}

	//solo operatore
	async delete(id: number): Promise<number> {
		const deleted = await Transit.destroy({
			where: { id: id },
		});
		return deleted;
	}
}

export default new TransitRepository();
