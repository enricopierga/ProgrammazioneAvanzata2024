import { Router } from "express";
import PaymentController from "../controllers/PaymentController";
import { requireAuthentication } from "../middleware/roles";

const router = Router();

router.post("/:id", requireAuthentication(["Automobilista"]), PaymentController.payInfractionByUuid);

export default router;
