// src/controllers/TransitController.ts
import { Request, Response } from 'express';
import TransitRepository from '../repositories/TransitRepository';

class TransitController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const transit = await TransitRepository.create(req.body);
      res.status(201).json(transit);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const transits = await TransitRepository.getAll();
      res.status(200).json(transits);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const transit = await TransitRepository.getById(req.params.id);
      if (transit) {
        res.status(200).json(transit);
      } else {
        res.status(404).json({ message: 'Transit not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const updated = await TransitRepository.update(req.params.id, req.body);
      if (updated) {
        res.status(200).json({ message: 'Transit updated successfully' });
      } else {
        res.status(404).json({ message: 'Transit not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await TransitRepository.delete(req.params.id);
      if (deleted) {
        res.status(200).json({ message: 'Transit deleted successfully' });
      } else {
        res.status(404).json({ message: 'Transit not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new TransitController();