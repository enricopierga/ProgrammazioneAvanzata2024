import { Router } from "express"; // Import the Router from Express
import SeedController from "../controllers/SeedController"; // Import the SeedController

// Create an instance of the Express router
const router = Router();

//Populate the database
router.post("/populate", SeedController.populate);

export default router;
