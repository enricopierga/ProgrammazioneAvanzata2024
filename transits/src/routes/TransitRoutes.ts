import { Router } from "express";
import TransitController from "../controllers/_transitController";
import { requireAuthentication } from "../middleware/authenticationMiddleware";

const router = Router();

// POST route to create a new transit
router.post(
  "",
  requireAuthentication(["Operatore", "Varco"]),
  TransitController.create
);

// GET route to retrieve transits
router.get(
  "",
  requireAuthentication(["Operatore"]),
  TransitController.getTransit
);

// PATCH route to update a transit by transitId
router.patch(
  "/:transitId",
  requireAuthentication(["Operatore"]),
  TransitController.update
);

// DELETE route to delete a transit by transitId
router.delete(
  "/:transitId",
  requireAuthentication(["Operatore"]),
  TransitController.delete
);

export default router;
