import Route from "../models/RouteModel";
import Transit from "../models/TransitModel";

class RouteRepository {
  async create(data: any): Promise<Route> {
    return await Route.create(data);
  }

  async getAll(): Promise<Route[]> {
    return await Route.findAll();
  }

  async getById(id: number): Promise<Route | null> {
    return await Route.findByPk(id);
  }

  async update(id: number, data: any): Promise<number> {
    const [updated] = await Route.update(data, {
      where: { id },
    });
    return updated;
  }

  async delete(id: number): Promise<number> {
    const transitDependency = await Transit.findOne({ where: { routeId: id } });
    if (transitDependency) {
      throw new Error(`Cannot delete route: it has associated transits.`);
    }

    return await Route.destroy({ where: { id: id } });
  }
}

export default new RouteRepository();
