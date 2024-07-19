import { Router } from "express"; // Import the Router from Express
import { requireAuthentication } from "../middlewares/authenticationMiddleware"; // Import the authentication middleware
import UserController from "../controllers/UserController"; // Import the UserController
import FinePdfController from "../controllers/FinePdfController"; // Import the FinePdfController

// Create an instance of the Express router
const router = Router();

// Route for user login, calls the login method of UserController
router.post("/login", UserController.login);

// Route to get user credit, accessible only to users with "Automobilista" and "Operatore" roles
router.get(
  "/credit",
  requireAuthentication(["Automobilista", "Operatore"]), // Authentication middleware checking for roles
  UserController.getCredit // Calls the getCredit method of UserController
);

// Route to add credit to a specific user, accessible only to Admin
router.patch(
  "/:id/credit",
  requireAuthentication(["Admin"]), // Authentication middleware checking for Admin role
  UserController.addCredit // Calls the addCredit method of UserController
);

// Route to get the infractions of the authenticated user, accessible only to users with "Automobilista" and "Operatore" roles
router.get(
  "/myInfraction",
  requireAuthentication(["Automobilista", "Operatore"]), // Authentication middleware checking for roles
  UserController.getMyInfractions // Calls the getMyInfractions method of UserController
);

// Route to get the PDF of a specific infraction, accessible only to users with "Automobilista" and "Operatore" roles
router.get(
  "/:id/pdf",
  requireAuthentication(["Automobilista", "Operatore"]), // Authentication middleware checking for roles
  FinePdfController.getPdf // Calls the getPdf method of FinePdfController
);

// Export the router to be used in other parts of the application
export default router;
