// src/routes/vehicleRoutes.ts c
import { Router } from "express";
import VehicleController from "../controllers/VehicleController";
import { requireAuthentication } from "../middleware/authenticationMiddleware";

const router = Router();

router.post("", requireAuthentication(["Operatore"]), VehicleController.create);
router.get(
  "",
  requireAuthentication(["Operatore"]),
  VehicleController.getVehicle
);
router.patch(
  "/:vehicleId",
  requireAuthentication(["Operatore"]),
  VehicleController.update
);
router.delete(
  "/:vehicleId",
  requireAuthentication(["Operatore"]),
  VehicleController.delete
);

export default router;
