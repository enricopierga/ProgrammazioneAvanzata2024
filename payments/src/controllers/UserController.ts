import { Request, Response } from "express";
import utenteRepository from "../repositories/userRepository";


class UserController {
/**
 * Controller per ricaricare il credito di un utente.
 */
	export const addCredit = async (req: Request, res: Response) => {
		const { utenteId, importo } = req.body;
		try {
			const utente = await utenteRepository.addCredit(utenteId, importo);
			if (!utente) {
				return res.status(404).json({ message: "Utente non trovato" });
			}
			res.status(200).json({
				message: "Credito ricaricato",
				credito: utente.credit,
			});
		} catch (error) {
			res.status(500).json({
				message: "Errore nel ricaricare il credito",
				error,
			});
		}
	};

 /**
 * Controller per recuperare il credito di un utente.
 */
	export const getCredit = async (req: Request, res: Response) => {	
		const { utenteId } = req.params;
		try {
			const credito = await utenteRepository.getCredit(parseInt(utenteId));
			if (credito === null) {
				return res.status(404).json({ message: "Utente non trovato" });
			}
			res.status(200).json({ credito });
		} catch (error) {
			    res.status(500).json({
				message: "Errore nel recuperare il credito",
				error,
			});
		}
	};
}