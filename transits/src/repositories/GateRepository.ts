import Gate from "../models/GateModel";
import Route from "../models/RouteModel";

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
    // Check for dependencies in routes
    const routeDependency =
      (await Route.findOne({ where: { startGateId: id } })) ||
      (await Route.findOne({ where: { endGateId: id } }));
    if (routeDependency) {
      throw new Error("Cannot delete gate: it has associated routes.");
    }

    return await Gate.destroy({ where: { id: id } });
  }
}

export default new GateRepository();
