// src/routes/gateRoutes.ts
import { Router } from "express";
import GateController from "../controllers/GateController";
import { requireAuthentication } from "../middleware/roles";

const router = Router();

router.post("/:id", requireAuthentication("Operatore"), GateController.create);
router.get("/:id", requireAuthentication("Operatore"), GateController.getGate); //specificare o meno gateId
router.patch(
  "/:id/:gateId",
  requireAuthentication("Operatore"),
  GateController.update
);
router.delete(
  "/:id/:gateId",
  requireAuthentication("Operatore"),
  GateController.delete
);

export default router;
