import { Router } from "express"; // Import the Router from Express
import SeedController from "../controllers/SeedController"; // Import the SeedController

// Create an instance of the Express router
const router = Router();

router.post("/popola", SeedController.popolate);

export default router;
