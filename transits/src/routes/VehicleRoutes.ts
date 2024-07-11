// src/routes/vehicleRoutes.ts c
import { Router } from 'express';
import VehicleController from '../controllers/VehicleController';
import {requireAuthentication} from "../middleware/roles";

const router = Router();

router.post('/:id',  requireAuthentication("Operatore"), VehicleController.create);
router.get('/:id',  requireAuthentication("Operatore"), VehicleController.getVehicle);
router.patch('/:id/:vehicleId',  requireAuthentication("Operatore"), VehicleController.update);
router.delete('/:id/:vehicleId',  requireAuthentication("Operatore"), VehicleController.delete);

export default router;
