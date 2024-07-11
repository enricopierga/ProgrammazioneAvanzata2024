import { Router } from "express";
import PaymentController from "../controllers/PaymentController";
import { requireAuthentication } from "../middleware/roles";

const router = Router();

//router.get("/getInfractions", requireAuthentication("Automobilista"), PaymentController.payInfractionByUuid);
router.get("/:id/:infractionId", requireAuthentication("Operatore"), PaymentController.getInfraction);

export default router;
