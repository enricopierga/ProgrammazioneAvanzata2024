import { Router } from "express";
import PaymentController from "../controllers/PaymentController";
import { requireAuthentication } from "../middleware/roles";
import UserController from "../controllers/UserController";

const router = Router();

router.post("/:id", requireAuthentication("Automobilista"), PaymentController.payInfractionByUuid);

router.get("/:id", requireAuthentication("Operatore"), UserController.getMyInfractions);

export default router;
