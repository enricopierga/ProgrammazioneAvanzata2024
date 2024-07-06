import { Router } from "express";
import { effettuaPagamento } from "../controllers/PaymentController";
import { authenticateJWT, authorizeAutomobilista } from "../middleware/roles";

const router = Router();

// Rotta per effettuare un pagamento, accessibile solo agli automobilisti
router.post(
	"/paga",
	authenticateJWT,
	authorizeAutomobilista,
	effettuaPagamento
);

export default router;
