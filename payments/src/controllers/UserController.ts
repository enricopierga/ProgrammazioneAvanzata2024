import { Request, Response } from "express"; // Import Request and Response types from Express
import utenteRepository from "../repositories/UserRepository"; // Import UserRepository
import PaymentRepository from "../repositories/PaymentRepository"; // Import PaymentRepository
import { paymentTypes } from "../models/PaymentModel"; // Import payment types from PaymentModel
import UserRepository from "../repositories/UserRepository"; // Import UserRepository
import InfractionRepository from "../repositories/InfractionRepository"; // Import InfractionRepository
import { generateJwt } from "../security/JWTservice"; // Import JWT generation service
import { isString } from "util"; // Import isString utility function
import { ReasonPhrases, StatusCodes } from "http-status-codes"; // Import HTTP status codes and reason phrases

class UserController {
  // Method for user login
  login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // Check if username is provided
    if (username === undefined || username === "") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Wrong username or password" });
    }

    // Check if password is provided
    if (password === undefined || password === "") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Wrong username or password" });
    }

    // Retrieve user by credentials
    const user = await UserRepository.getByCredentials(username, password);

    // Check if user is found
    if (user === null) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    // Generate JWT token for the user
    const jwtToken = generateJwt({ userId: user.id, role: user.role });
    return res.status(StatusCodes.OK).json({ accessToken: jwtToken });
  };

  /**
   * Controller to add credit to a user's account.
   */
  addCredit = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);

    // Check if userId is valid
    if (isNaN(userId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid ID format" });
      return;
    }

    // Retrieve user by ID
    const userFound = await UserRepository.getById(userId);

    // Check if user is found
    if (userFound === null) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const { amount } = req.body;

    // Validate the amount
    if (amount === undefined || isNaN(amount) || isString(amount)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing or wrong amount value" });
    }

    // Increase user's credit
    const utente = await UserRepository.increaseCredit(userId, amount);

    // Create a Payment object to record the transaction
    const paymentData = {
      userId: userId,
      amount: amount,
      paymentType: paymentTypes.addBalance,
    };

    const payment = await PaymentRepository.createPayment(paymentData);

    // Check if credit increase was successful
    if (!utente) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    res.status(StatusCodes.OK).json({
      balance: utente.credit,
    });
  };

  // Method to get the user's current credit balance
  getCredit = async (req: Request, res: Response) => {
    const credito = await utenteRepository.getCredit(req.user!.userId);
    if (credito === null) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json({ balance: credito });
  };

  // Method to get the infractions of the authenticated user
  getMyInfractions = async (req: Request, res: Response) => {
    const userInfractions = await InfractionRepository.getInfractionsByUserId(
      req.user!.userId
    );

    res.status(StatusCodes.OK).json(userInfractions);
  };
}

export default new UserController(); // Export an instance of UserController
