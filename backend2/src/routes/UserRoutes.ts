import { Router } from "express";
import { ricaricaCredito, getCredito } from "../controllers/UserController";
import {
	authenticateJWT,
	authorizeOperatore,
	authorizeAutomobilista,
} from "../middleware/roles";

const router = Router();

// Rotta per ricaricare il credito, accessibile solo agli operatori
router.post("/ricarica", authenticateJWT, authorizeOperatore, ricaricaCredito);

// Rotta per ottenere il credito di un utente, accessibile solo agli automobilisti
router.get(
	"/credito/:utenteId",
	authenticateJWT,
	authorizeAutomobilista,
	getCredito
);

export default router;
