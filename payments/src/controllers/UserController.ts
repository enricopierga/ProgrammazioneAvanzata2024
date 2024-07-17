import { Request, Response } from "express";
import utenteRepository from "../repositories/UserRepository";
import PaymentRepository from "../repositories/PaymentRepository";
import { paymentTypes } from "../models/PaymentModel";
import UserRepository from "../repositories/UserRepository";
import InfractionRepository from "../repositories/InfractionRepository";
import { generateJwt } from "../security/JWTservice";
import { isString } from "util";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

class UserController {
  login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (username === undefined || username === "") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Wrong username or password" });
    }

    if (password === undefined || password === "") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Wrong username or password" });
    }

    const user = await UserRepository.getByCredentials(username, password);

    if (user === null) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const jwtToken = generateJwt({ userId: user.id, role: user.role });
    return res.status(StatusCodes.OK).json({ accessToken: jwtToken });
  };

  /**
   * Controller per ricaricare il credito di un utente.
   */
  addCredit = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid ID format" });
      return;
    }

    const userFound = await UserRepository.getById(userId);

    if (userFound === null) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }



    const { amount } = req.body;

    if (amount === undefined || isNaN(amount) || isString(amount)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing or wrong amount value" });
    }

    const utente = await utenteRepository.increaseCredit(userId, amount);

    //Creo oggetto Payment per salvare il pagamento all'interno della tabella payments
    const paymentData = {
      userId: userId,
      amount: amount,
      paymentType: paymentTypes.addBalance,
    };

    const payment = await PaymentRepository.createPayment(paymentData);

    if (!utente) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    res.status(StatusCodes.OK).json({
      balance: utente.credit,
    });
  };

  /**
   * Controller per recuperare il credito di un utente.
   */
  getCredit = async (req: Request, res: Response) => {
    const credito = await utenteRepository.getCredit(req.user!.userId);
    if (credito === null) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json({ balance: credito });
  };

  getMyInfractions = async (req: Request, res: Response) => {
    const userInfractions = await InfractionRepository.getInfractionsByUserId(
      req.user!.userId
    );

    res.status(StatusCodes.OK).json(userInfractions);
  };
}
export default new UserController();
