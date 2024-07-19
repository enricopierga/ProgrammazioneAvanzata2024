import { Router } from "express";
import InfractionController from "../controllers/_infractionController";
import { requireAuthentication } from "../middleware/authenticationMiddleware";

const router = Router();

// GET route to retrieve infractions by plates and period
router.get(
  "",
  requireAuthentication(["Operatore", "Automobilista"]),
  InfractionController.getByPlatesAndPeriod
);

export default router;
