// src/routes/infractionRoutes.ts
import { Router } from 'express';
import InfractionController from '../controllers/infractionController';
import { requireAuthentication } from '../middleware/roles';

const router = Router();

router.get('/:id', requireAuthentication("Operatore" || "Automobilista"), InfractionController.getByPlatesAndPeriod);

export default router;