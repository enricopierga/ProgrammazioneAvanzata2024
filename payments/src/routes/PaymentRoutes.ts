import { Router } from "express";
import PaymentController from "../controllers/PaymentController";
import { authenticateJWT, authorizeAutomobilista } from "../middleware/roles";

const router = Router();

// Rotta per effettuare un pagamento di una multa, accessibile solo agli automobilisti
router.post(
	"/paga",
	authenticateJWT,
	authorizeAutomobilista,
	PaymentController.payInfractionById
);

export default router;
