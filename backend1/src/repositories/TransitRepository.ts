// src/repositories/TransitRepository.ts
import Transit from '../models/Transit';

class TransitRepository {
  async create(data: any): Promise<Transit> {
    return await Transit.create(data);
  }

  async getAll(): Promise<Transit[]> {
    return await Transit.findAll();
  }

  async getById(id: number): Promise<Transit | null> {
    return await Transit.findByPk(id);
  }

  async update(id: number, data: any): Promise<number> {
    const [updated] = await Transit.update(data, {
      where: { id }
    });
    return updated;
  }

  async delete(id: number): Promise<number> {
    const deleted = await Transit.destroy({
      where: { id }
    });
    return deleted;
  }
}

export default new TransitRepository();