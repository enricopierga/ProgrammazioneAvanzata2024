import { Router } from "express";
import payInfractionById from "../controllers/paymentController";
import { authenticateJWT, authorizeAutomobilista, authorizeOperatore } from "../middleware/roles";

const router = Router();

// Rotta per effettuare un pagamento di una multa, accessibile solo agli automobilisti
router.post(
	"/paga",
	authenticateJWT,
	authorizeAutomobilista,
	payInfractionById
);

export default router;




