import { Router } from 'express';
import { effettuaPagamento } from '../controllers/PaymentController';

const router = Router();

router.post('/paga', effettuaPagamento);

export default router;
