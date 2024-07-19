import { Router } from "express";
import InfractionController from "../controllers/InfractionController";
import { requireAuthentication } from "../middleware/authenticationMiddleware";

const router = Router();

// GET route to retrieve infractions by plates and period
router.get(
  "",
  requireAuthentication(["Operatore", "Automobilista"]),
  InfractionController.getByPlatesAndPeriod
);

export default router;
