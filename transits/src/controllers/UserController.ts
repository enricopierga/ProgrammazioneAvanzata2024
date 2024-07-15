import { Request, Response } from "express";
import utenteRepository from "../repositories/UserRepository";
import UserRepository from "../repositories/UserRepository";
import { generateJwt } from "../security/JWTservice";
import { isString } from "util";
import { StatusCodes } from "http-status-codes";

class UserController {

	login = async (req: Request, res: Response) => {
		const { username, password } = req.body;
		if (username == undefined || username == "") {
			return res.status(StatusCodes.BAD_REQUEST).json({ message: "Wrong username or password" })
		}

		if (password == undefined || password == "") {
			return res.status(StatusCodes.BAD_REQUEST).json({ message: "Wrong username or password" })
		}

		const user = await UserRepository.getByCredentials(username, password);

		if (user == null) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" })
		}

		const jwtToken = generateJwt({ userId: user.id, role: user.role });
		return res.status(StatusCodes.OK).json({ accessToken: jwtToken })
	}

	/**
	 * Controller per ricaricare il credito di un utente.
	 */
	addCredit = async (req: Request, res: Response) => {
		const userId = Number(req.params.id);

		if (isNaN(userId)) {
			res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid ID format" });
			return;
		}
		const { amount } = req.body;

		if (amount == undefined || isNaN(amount) || isString(amount)) {
			res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing or wrong amount value" });
			return;
		}

		const utente = await UserRepository.increaseCredit(userId, amount);

		if (!utente) {
			res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
			return;
		}
		res.status(StatusCodes.OK).json({balance: utente.credit});
		return;
	};

	/**
	 * Controller per recuperare il credito di un utente.
	 */
	getCredit = async (req: Request, res: Response) => {
		const userId = Number(req.params.id);

		if (isNaN(userId)) {
			res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid ID format" });
			return;
		}

		const credito = await utenteRepository.getCredit(Number(userId));
		if (credito === null) {
			res.status(StatusCodes.NOT_FOUND).json({ message: "Utente non trovato" });
			return;
		}

		res.status(StatusCodes.OK).json({ credito });
		return;
	};
}

export default new UserController();

