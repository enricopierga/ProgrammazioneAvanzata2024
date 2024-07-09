import Infraction from "../models/InfractionsModel";
import { v4 as UUIDV4 } from "uuid";

class InfractionRepository {
	async create(data: any): Promise<Infraction> {
		data.uuid = UUIDV4();
		return await Infraction.create(data);
	}

	async getAll(): Promise<Infraction[]> {
		return await Infraction.findAll();
	}

	async getById(id: number): Promise<Infraction | null> {
		return await Infraction.findByPk(id);
	}

	async getByUuid(uuid: string): Promise<Infraction | null> {
		return await Infraction.findOne({ where: { fineId: uuid } });
	}

	async update(id: number, data: any): Promise<number> {
		const [updated] = await Infraction.update(data, {
			where: { id },
		});
		return updated;
	}

	async delete(id: number): Promise<number> {
		const deleted = await Infraction.destroy({
			where: { id },
		});
		return deleted;
	}
}

export default new InfractionRepository();
