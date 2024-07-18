import { Router } from "express";
import RouteController from "../controllers/RouteController";
import { requireAuthentication } from "../middleware/authenticationMiddleware";

const router = Router();

// POST route to create a new route
router.post("", requireAuthentication(["Operatore"]), RouteController.create);

// GET route to retrieve routes
router.get("", requireAuthentication(["Operatore"]), RouteController.getRoute);

// PATCH route to update a route by routeId
router.patch(
  "/:routeId",
  requireAuthentication(["Operatore"]),
  RouteController.update
);

// DELETE route to delete a route by routeId
router.delete(
  "/:routeId",
  requireAuthentication(["Operatore"]),
  RouteController.delete
);

export default router;
