// src/routes/vehicleRoutes.ts c
import { Router } from 'express';
import VehicleController from '../controllers/VehicleController';

const router = Router();

router.post('/vehicles', VehicleController.create);
router.get('/vehicles', VehicleController.getAll);
router.get('/vehicles/:id', VehicleController.getById);
router.put('/vehicles/:id', VehicleController.update);
router.delete('/vehicles/:id', VehicleController.delete);

export default router;