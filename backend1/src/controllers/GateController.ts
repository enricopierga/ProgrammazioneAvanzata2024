// src/controllers/GateController.ts
import { Request, Response } from 'express';
import GateRepository from '../repositories/GateRepository';

class GateController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const gate = await GateRepository.create(req.body);
      res.status(201).json(gate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const gates = await GateRepository.getAll();
      res.status(200).json(gates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const gate = await GateRepository.getById(req.params.id);
      if (gate) {
        res.status(200).json(gate);
      } else {
        res.status(404).json({ message: 'Gate not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const updated = await GateRepository.update(req.params.id, req.body);
      if (updated) {
        res.status(200).json({ message: 'Gate updated successfully' });
      } else {
        res.status(404).json({ message: 'Gate not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await GateRepository.delete(req.params.id);
      if (deleted) {
        res.status(200).json({ message: 'Gate deleted successfully' });
      } else {
        res.status(404).json({ message: 'Gate not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new GateController();