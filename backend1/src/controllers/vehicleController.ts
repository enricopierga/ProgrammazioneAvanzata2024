// src/controllers/VehicleController.ts 
import { Request, Response } from 'express';
import VehicleRepository from '../repositories/VehicleRepository';

class VehicleController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const vehicle = await VehicleRepository.create(req.body);
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const vehicles = await VehicleRepository.getAll();
      res.status(200).json(vehicles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const vehicle = await VehicleRepository.getById(req.params.id);
      if (vehicle) {
        res.status(200).json(vehicle);
      } else {
        res.status(404).json({ message: 'Vehicle not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const updated = await VehicleRepository.update(req.params.id, req.body);
      if (updated) {
        res.status(200).json({ message: 'Vehicle updated successfully' });
      } else {
        res.status(404).json({ message: 'Vehicle not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await VehicleRepository.delete(req.params.id);
      if (deleted) {
        res.status(200).json({ message: 'Vehicle deleted successfully' });
      } else {
        res.status(404).json({ message: 'Vehicle not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new VehicleController();