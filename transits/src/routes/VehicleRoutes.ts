import { Router } from "express";
import VehicleController from "../controllers/_vehicleController";
import { requireAuthentication } from "../middleware/authenticationMiddleware";

const router = Router();

// POST route to create a new vehicle
router.post("", requireAuthentication(["Operatore"]), VehicleController.create);

// GET route to retrieve vehicles
router.get(
  "",
  requireAuthentication(["Operatore"]),
  VehicleController.getVehicle
);

// PATCH route to update a vehicle by vehicleId
router.patch(
  "/:vehicleId",
  requireAuthentication(["Operatore"]),
  VehicleController.update
);

// DELETE route to delete a vehicle by vehicleId
router.delete(
  "/:vehicleId",
  requireAuthentication(["Operatore"]),
  VehicleController.delete
);

export default router;
