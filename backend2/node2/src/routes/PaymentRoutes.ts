import { Router } from 'express';
import { effettuaPagamento } from '../controllers/pagamentoController';
import { authenticateJWT, authorizeAutomobilista } from '../middleware/role';

const router = Router();

// Rotta per effettuare un pagamento, accessibile solo agli automobilisti
router.post('/paga', authenticateJWT, authorizeAutomobilista, effettuaPagamento);

export default router;
