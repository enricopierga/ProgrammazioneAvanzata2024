// src/routes/gateRoutes.ts
import { Router } from "express";
import GateController from "../controllers/GateController";
import { requireAuthentication } from "../middleware/authenticationMiddleware";

const router = Router();

router.post("", requireAuthentication(["Operatore"]), GateController.create);
router.get("", requireAuthentication(["Operatore"]), GateController.getGate);
router.patch(
  "/:gateId",
  requireAuthentication(["Operatore"]),
  GateController.update
);
router.delete(
  "/:gateId",
  requireAuthentication(["Operatore"]),
  GateController.delete
);

export default router;
