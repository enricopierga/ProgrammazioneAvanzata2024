import Gate from "../models/GateModel";

class GateRepository {
	async create(data: any): Promise<Gate> {
		return await Gate.create(data);
	}

	async getAll(): Promise<Gate[]> {
		return await Gate.findAll();
	}

	async getById(gateId: number): Promise<Gate | null> {
		return await Gate.findByPk(gateId);
	}

	async update(id: number, data: any): Promise<number> {
		const [updated] = await Gate.update(data, {
			where: { id },
		});
		return updated;
	}

	async delete(id: number): Promise<number> {
		const deleted = await Gate.destroy({
			where: { id },
		});
		return deleted;
	}
}

export default new GateRepository();
