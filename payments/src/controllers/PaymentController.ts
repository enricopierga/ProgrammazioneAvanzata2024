import { Request, Response } from "express";
// import pagamentoRepository from "../repositories/pagamentoRepository";
import utenteRepository from "../repositories/UserRepository";

/**
 * Controller per effettuare un pagamento.
 */
export const effettuaPagamento = async (req: Request, res: Response) => {
	const { utenteId, uuidPagamento, importo } = req.body;
	try {
		const utente = await utenteRepository.getById(utenteId);
		if (!utente) {
			return res.status(404).json({ message: "Utente non trovato" });
		}
		if (utente.credit < importo) {
			return res.status(400).json({ message: "Credito insufficiente" });
		}
		utente.credit -= importo;
		await utente.save();

		/*
        TODO: Da collegare il repo quando verrà creato
		const pagamento = await pagamentoRepository.createPagamento(
			uuidPagamento,
			importo,
			utenteId
		);
		res.status(200).json({ message: "Pagamento effettuato", pagamento });
        */

		res.status(200).json({ message: "Pagamento effettuato" });
	} catch (error) {
		res.status(500).json({ message: "Errore nel pagamento", error });
	}
};
