import { Request, Response } from "express";
import utenteRepository from "../repositories/UserRepository";
import UserRepository from "../repositories/UserRepository";
import { generateJwt } from "../security/JWTservice";
import { isString } from "util";

class UserController {

	login = async (req: Request, res: Response) => {
		const { username, password } = req.body;
		if (username == undefined || username == "") {
			return res.status(400).json({ message: "Wrong username or password" })
		}

		if (password == undefined || password == "") {
			return res.status(400).json({ message: "Wrong username or password" })
		}

		const user = await UserRepository.getByCredentials(username, password);

		if (user == null) {
			return res.status(404).json({ message: "User not found" })
		}

		const jwtToken = generateJwt({ userId: user.id, role: user.role });
		return res.status(200).json({ accessToken: jwtToken })

	}

	/**
	 * Controller per ricaricare il credito di un utente.
	 */
	addCredit = async (req: Request, res: Response) => {
		const userId = Number(req.params.id);

		if (isNaN(userId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}
		const { amount } = req.body;

		if (amount == undefined || isNaN(amount) || isString(amount)) {
			return res.status(400).json({ message: "Missing or wrong amount value" })
		}


		const utente = await utenteRepository.addCredit(userId, amount);

		if (!utente) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json({
			balance: utente.credit,
		});
	};

	/**
	 * Controller per recuperare il credito di un utente.
	 */
	getCredit = async (req: Request, res: Response) => {
		const userId = Number(req.params.id);

		if (isNaN(userId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const credito = await utenteRepository.getCredit(Number(userId));
		if (credito === null) {
			return res.status(404).json({ message: "Utente non trovato" });
		}
		res.status(200).json({ credito });
	};
}

export default new UserController();

