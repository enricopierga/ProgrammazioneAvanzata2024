// src/routes/infractionRoutes.ts
import { Router } from 'express';
import InfractionController from '../controllers/InfractionController';

const router = Router();

router.post('/infractions', InfractionController.create);
router.get('/infractions', InfractionController.getAll);
router.get('/infractions/:id', InfractionController.getById);
router.put('/infractions/:id', InfractionController.update);
router.delete('/infractions/:id', InfractionController.delete);
router.get('/infractions/vehicle-period', InfractionController.getByVehicleAndPeriod);

export default router;