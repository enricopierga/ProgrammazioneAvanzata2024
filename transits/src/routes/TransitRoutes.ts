// src/routes/transitRoutes.ts
import { Router } from "express";
import TransitController from "../controllers/TransitController";
import { requireAuthentication } from "../middleware/authenticationMiddleware";

const router = Router();

router.post(
  "",
  requireAuthentication(["Operatore", "Varco"]),
  TransitController.create
);
router.get(
  "",
  requireAuthentication(["Operatore"]),
  TransitController.getTransit
);
router.patch(
  "/:transitId",
  requireAuthentication(["Operatore"]),
  TransitController.update
);
router.delete(
  "/:transitId",
  requireAuthentication(["Operatore"]),
  TransitController.delete
);

export default router;
