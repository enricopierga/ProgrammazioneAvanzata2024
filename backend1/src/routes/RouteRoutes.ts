// src/routes/routeRoutes.ts
import { Router } from 'express';
import RouteController from '../controllers/RouteController';

const router = Router();

router.post('/routes', RouteController.create);
router.get('/routes', RouteController.getAll);
router.get('/routes/:id', RouteController.getById);
router.put('/routes/:id', RouteController.update);
router.delete('/routes/:id', RouteController.delete);

export default router;