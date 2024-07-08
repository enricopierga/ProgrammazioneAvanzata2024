// src/routes/transitRoutes.ts
import { Router } from 'express';
import TransitController from '../controllers/TransitController';

const router = Router();

router.post('/transits', TransitController.create);
router.get('/transits', TransitController.getAll);
router.get('/transits/:id', TransitController.getById);
router.put('/transits/:id', TransitController.update);
router.delete('/transits/:id', TransitController.delete);

export default router;