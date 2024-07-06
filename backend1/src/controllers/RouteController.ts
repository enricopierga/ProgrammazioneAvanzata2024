// src/controllers/RouteController.ts
import { Request, Response } from 'express';
import RouteRepository from '../repositories/RouteRepository';

class RouteController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const route = await RouteRepository.create(req.body);
      res.status(201).json(route);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const routes = await RouteRepository.getAll();
      res.status(200).json(routes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const route = await RouteRepository.getById(req.params.id);
      if (route) {
        res.status(200).json(route);
      } else {
        res.status(404).json({ message: 'Route not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const updated = await RouteRepository.update(req.params.id, req.body);
      if (updated) {
        res.status(200).json({ message: 'Route updated successfully' });
      } else {
        res.status(404).json({ message: 'Route not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await RouteRepository.delete(req.params.id);
      if (deleted) {
        res.status(200).json({ message: 'Route deleted successfully' });
      } else {
        res.status(404).json({ message: 'Route not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new RouteController();