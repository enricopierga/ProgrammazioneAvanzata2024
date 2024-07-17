import { Router } from "express";
import PaymentController from "../controllers/PaymentController";
import { requireAuthentication } from "../middlewares/authenticationMiddleware";

const router = Router();

router.post(
  "/paga",
  requireAuthentication(["Automobilista", "Operatore"]),
  PaymentController.payInfractionByUuid
);

export default router;
