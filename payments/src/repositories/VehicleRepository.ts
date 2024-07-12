import Vehicle from "../models/VehicleModel";

class VehicleRepository {

	async getByUserId(userId: number): Promise<Vehicle[]> {

		return await Vehicle.findAll({
			where: {
				userId: userId
			}
		});
	}
	async create(data: any): Promise<Vehicle> {
		return await Vehicle.create(data);
	}

	async getAll(): Promise<Vehicle[]> {
		return await Vehicle.findAll();
	}

	async getById(id: number): Promise<Vehicle | null> {
		return await Vehicle.findByPk(id);
	}

	async update(id: number, data: any): Promise<number> {
		const [updated] = await Vehicle.update(data, {
			where: { id },
		});
		return updated;
	}

	async delete(id: number): Promise<number> {
		const deleted = await Vehicle.destroy({
			where: { id },
		});
		return deleted;
	}
}

export default new VehicleRepository();
