// src/controllers/InfractionController.ts
import { Request, Response } from 'express';
import InfractionRepository from '../repositories/InfractionRepository';

class InfractionController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const infraction = await InfractionRepository.create(req.body);
      res.status(201).json(infraction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const infractions = await InfractionRepository.getAll();
      res.status(200).json(infractions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const infraction = await InfractionRepository.getById(req.params.id);
      if (infraction) {
        res.status(200).json(infraction);
      } else {
        res.status(404).json({ message: 'Infraction not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const updated = await InfractionRepository.update(req.params.id, req.body);
      if (updated) {
        res.status(200).json({ message: 'Infraction updated successfully' });
      } else {
        res.status(404).json({ message: 'Infraction not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await InfractionRepository.delete(req.params.id);
      if (deleted) {
        res.status(200).json({ message: 'Infraction deleted successfully' });
      } else {
        res.status(404).json({ message: 'Infraction not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByVehicleAndPeriod(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleId, startDate, endDate } = req.query;
      const infractions = await InfractionRepository.getByVehicleAndPeriod(
        Number(vehicleId),
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.status(200).json(infractions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new InfractionController();