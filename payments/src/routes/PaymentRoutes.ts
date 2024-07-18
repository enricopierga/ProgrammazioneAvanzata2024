import { Router } from "express"; // Import the Router from Express
import PaymentController from "../controllers/PaymentController"; // Import the PaymentController
import { requireAuthentication } from "../middlewares/authenticationMiddleware"; // Import the authentication middleware

// Create an instance of the Express router
const router = Router();

// Route to pay an infraction by UUID, accessible only to users with "Automobilista" and "Operatore" roles
router.post(
  "/paga",
  requireAuthentication(["Automobilista", "Operatore"]), // Authentication middleware checking for roles
  PaymentController.payInfractionByUuid // Calls the payInfractionByUuid method of PaymentController
);

// Export the router to be used in other parts of the application
export default router;
