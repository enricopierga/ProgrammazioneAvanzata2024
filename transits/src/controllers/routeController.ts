// src/controllers/RouteController.ts
import { Request, Response } from "express";
import RouteRepository from "../repositories/RouteRepository";

class RouteController {
	async create(req: Request, res: Response): Promise<void> {
		const route = await RouteRepository.create(req.body);
		res.status(201).json(route);
	}

	async getAll(req: Request, res: Response): Promise<void> {
		const routes = await RouteRepository.getAll();
		res.status(200).json(routes);
	}

	async getById(req: Request, res: Response): Promise<void> {
		const routeId = Number(req.params.id);

		if (isNaN(routeId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const route = await RouteRepository.getById(routeId);
		if (route) {
			res.status(200).json(route);
		} else {
			res.status(404).json({ message: "Route not found" });
		}
	}

	async update(req: Request, res: Response): Promise<void> {
		const routeId = Number(req.params.id);

		if (isNaN(routeId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const updated = await RouteRepository.update(routeId, req.body);

		if (updated) {
			res.status(200).json({ message: "Route updated successfully" });
		} else {
			res.status(404).json({ message: "Route not found" });
		}
	}

	async delete(req: Request, res: Response): Promise<void> {
		const routeId = Number(req.params.id);

		if (isNaN(routeId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const deleted = await RouteRepository.delete(routeId);
		if (deleted) {
			res.status(200).json({ message: "Route deleted successfully" });
		} else {
			res.status(404).json({ message: "Route not found" });
		}
	}
}

export default new RouteController();
