import { Router } from "express";
import PaymentController from "../controllers/PaymentController";
import { requireAuthentication } from "../middleware/roles";

const router = Router();

router.post("/", requireAuthentication(["Automobilista", "Operatore"]), PaymentController.payInfractionByUuid);

export default router;
