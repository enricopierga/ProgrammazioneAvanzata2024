// src/routes/routeRoutes.ts
import { Router } from "express";
import RouteController from "../controllers/RouteController";
import { requireAuthentication } from "../middleware/authenticationMiddleware";

const router = Router();

router.post("", requireAuthentication(["Operatore"]), RouteController.create);
router.get("", requireAuthentication(["Operatore"]), RouteController.getRoute);
router.patch(
  "/:routeId",
  requireAuthentication(["Operatore"]),
  RouteController.update
);
router.delete(
  "/:routeId",
  requireAuthentication(["Operatore"]),
  RouteController.delete
);

export default router;
