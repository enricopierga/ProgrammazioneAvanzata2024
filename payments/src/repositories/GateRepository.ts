import Gate from "../models/GateModel"; // Import the Gate model
import Route from "../models/RouteModel"; // Import the Route model

class GateRepository {
  // Method to create a new gate
  async create(data: any): Promise<Gate> {
    return await Gate.create(data);
  }

  // Method to retrieve all gates
  async getAll(): Promise<Gate[]> {
    return await Gate.findAll();
  }

  // Method to retrieve a gate by its ID
  async getById(gateId: number): Promise<Gate | null> {
    return await Gate.findByPk(gateId);
  }

  // Method to update a gate by its ID
  async update(id: number, data: any): Promise<number> {
    const [updated] = await Gate.update(data, {
      where: { id },
    });
    return updated;
  }

  // Method to delete a gate by its ID
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

export default new GateRepository(); // Export an instance of GateRepository
