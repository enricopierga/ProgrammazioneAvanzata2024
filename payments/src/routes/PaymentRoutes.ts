import { Router } from "express";
import PaymentController from "../controllers/PaymentController";
import { requireAuthentication } from "../middleware/roles";

const router = Router();

// Rotta per effettuare un pagamento di una multa, accessibile solo agli automobilisti
router.post(
	"/paga",
	requireAuthentication("Automobilista"),
	PaymentController.payInfractionById
);

export default router;
