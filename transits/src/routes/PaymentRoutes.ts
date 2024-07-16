import { Router } from "express";
import PaymentController from "../controllers/PaymentController";
import { requireAuthentication } from "../middleware/authenticationMiddleware";

const router = Router();

router.post(
  "/paga",
  requireAuthentication(["Automobilista"]),
  PaymentController.payInfractionByUuid
);

export default router;
