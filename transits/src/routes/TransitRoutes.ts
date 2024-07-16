// src/routes/transitRoutes.ts
import { Router } from "express";
import TransitController from "../controllers/TransitController";
import { requireAuthentication } from "../middleware/authenticationMiddleware";

const router = Router();

router.post(
  "/:id",
  requireAuthentication(["Operatore", "Varco"]),
  TransitController.create
);
router.get(
  "/:id",
  requireAuthentication(["Operatore"]),
  TransitController.getTransit
);
router.patch(
  "/:id/:transitId",
  requireAuthentication(["Operatore"]),
  TransitController.update
);
router.delete(
  "/:id/:transitId",
  requireAuthentication(["Operatore"]),
  TransitController.delete
);

export default router;
