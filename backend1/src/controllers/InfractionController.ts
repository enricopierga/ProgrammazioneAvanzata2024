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
      const