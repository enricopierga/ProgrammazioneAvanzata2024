import { Request, Response } from "express";
import utenteRepository from "../repositories/UserRepository";

class UserController {
	/**
	 * Controller per ricaricare il credito di un utente.
	 */
	addCredit = async (req: Request, res: Response) => {
		const utenteId = Number(req.params.id);

		if (isNaN(utenteId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const { importo } = req.body;

		const utente = await utenteRepository.addCredit(utenteId, importo);
		if (!utente) {
			return res.status(404).json({ message: "Utente non trovato" });
		}
		res.status(200).json({
			message: "Credito ricaricato",
			credito: utente.credit,
		});
	};

	/**
	 * Controller per recuperare il credito di un utente.
	 */
	getCredit = async (req: Request, res: Response) => {
		const utenteId = Number(req.params.id);

		if (isNaN(utenteId)) {
			res.status(400).json({ message: "Invalid ID format" });
			return;
		}

		const credito = await utenteRepository.getCredit(Number(utenteId));
		if (credito === null) {
			return res.status(404).json({ message: "Utente non trovato" });
		}
		res.status(200).json({ credito });
	};
}

export default new UserController();
