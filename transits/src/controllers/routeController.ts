// src/controllers/RouteController.ts
import { Request, Response } from "express";
import RouteRepository from "../repositories/RouteRepository";
import GateRepository from "../repositories/GateRepository";

class RouteController {
	checkGatesIds = async (res: Response, startGateId: number, endGateId: number): Promise<boolean> => {
	  
			// Verifica se startGateId e endGateId esistono nella tabella Gates
			const startGate = await GateRepository.getById(startGateId);
			const endGate = await GateRepository.getById(endGateId);

			if (!startGate && !endGate) {
				res.status(400).json({ message: `Start gate with ID ${startGateId} and end gate with ID ${endGateId} do not exist` });
				return false;
			}
	  
			if (!startGate) {
			  res.status(400).json({ message: `Start gate with ID ${startGateId} does not exist` });
			  return false;
			}
	  
			if (!endGate) {
			  res.status(400).json({ message: `End gate with ID ${endGateId} does not exist` });
			  return false;
			}
		return true;
	}

	async create(req: Request, res: Response): Promise<void> {
			const { startGateId, endGateId } = req.body;
			if (await this.checkGatesIds(res, startGateId, endGateId)) {
			    const route = await RouteRepository.create(req.body);
			    res.status(201).json(route);
			}
	}
	

	async getRoute(req: Request, res: Response): Promise<void> {

		try {
			if (req.query.routeId) {
			  const routeId = Number(req.query.routeId);
	  
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
			} else {
			  const routes = await RouteRepository.getAll();
			  res.status(200).json(routes);
			}
		} catch {
			  res.status(500).json({ message: "Error fetching route(s)"});
			}
	}
	

	async update(req: Request, res: Response): Promise<void> {
		try {
			const routeId = Number(req.params.routeId);
	  
			if (isNaN(routeId)) {
			  res.status(400).json({ message: "Invalid ID format" });
			  return;
			}
			
			const { startGateId, endGateId } = req.body;
			if (await this.checkGatesIds(req, res, startGateId, endGateId)) {
			    const updated = await RouteRepository.update(routeId, req.body);
			    if (updated) {
			        res.status(200).json({ message: "Route updated successfully" });
			    } else {
			        res.status(404).json({ message: "Route not found" });
			    }
			}	
		} catch  {
			  res.status(500).json({ message: "Error updating route"});
	    }
	}

	async delete(req: Request, res: Response): Promise<void> {
		try {
			const routeId = Number(req.params.routeId);
	  
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
		} catch (err) {
			const error = err as Error;
			if (error.message.includes('Cannot delete route')) {
			  res.status(400).json({ message: error.message });
			} else {
			  res.status(500).json({ message: "Error deleting route"});
		    }
	    }
	}
}

export default new RouteController();
