import { Router } from "express";
import GateController from "../controllers/_gateController";
import { requireAuthentication } from "../middleware/authenticationMiddleware";

const router = Router();

// POST route to create a new Gate
router.post("", requireAuthentication(["Operatore"]), GateController.create);

// GET route to retrieve Gates
router.get("", requireAuthentication(["Operatore"]), GateController.getGate);

// PATCH route to update an existing Gate
router.patch(
  "/:gateId",
  requireAuthentication(["Operatore"]),
  GateController.update
);

// DELETE route to delete a Gate
router.delete(
  "/:gateId",
  requireAuthentication(["Operatore"]),
  GateController.delete
);

export default router;
