// src/routes/gateRoutes.ts
import { Router } from 'express';
import GateController from '../controllers/gateController';

const router = Router();

router.post('/gates', GateController.create);
router.get('/gates', GateController.getAll);
router.get('/gates/:id', GateController.getById);
router.put('/gates/:id', GateController.update);
router.delete('/gates/:id', GateController.delete);

export default router;
