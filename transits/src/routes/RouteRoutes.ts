// src/routes/routeRoutes.ts
import { Router } from 'express';
import RouteController from '../controllers/routeController';
import {requireAuthentication} from "../middleware/roles";

const router = Router();

router.post('/:id', requireAuthentication("Operatore"), RouteController.create);
router.get('/:id', requireAuthentication("Operatore"), RouteController.getRoute);
router.patch('/:id/:routeId', requireAuthentication("Operatore"), RouteController.update);
router.delete('/:id/:routeId', requireAuthentication("Operatore"), RouteController.delete);

export default router;
