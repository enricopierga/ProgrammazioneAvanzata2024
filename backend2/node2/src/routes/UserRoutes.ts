import { Router } from 'express';
import { ricaricaCredito, getCredito } from '../controllers/UserController';

const router = Router();

router.post('/ricarica', ricaricaCredito);
router.get('/credito/:utenteId', getCredito);

export default router;
