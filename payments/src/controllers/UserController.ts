import { Request, Response } from "express";
import utenteRepository from "../repositories/UserRepository";

export const getUsers = async (req: Request, res: Response) => {
	res.json([
		{
			id: 1,
			name: "Mario Rossi",
			email: "mario.rossi@example.com",
		},
		{
			id: 2,
			name: "Enrico Piergallini",
			email: "enrico.piergallini@gamil.com",
		},
	]);
};

export const getUser = async (req: Request, res: Response) => {
	const user = {
		id: 1,
		name: "Mario Rossi",
		email: "mario.rossi@example.com",
		credito: 0,
	};

	if (parseInt(req.params.id, 10) === user.id) {
		res.json(user);
	} else {
		res.status(404).send("User not found");
	}
};

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
 * Controller per ottenere il credito di un utente.
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
