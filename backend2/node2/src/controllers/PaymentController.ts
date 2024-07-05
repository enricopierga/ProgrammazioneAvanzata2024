import { Request, Response } from 'express';
import Pagamento from '../models/Payment';
import Utente from '../models/User';

export const effettuaPagamento = async (req: Request, res: Response) => {
  const { utenteId, uuidPagamento, importo } = req.body;
  try {
    const utente = await Utente.findByPk(utenteId);
    if (!utente) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    if (utente.credito < importo) {
      return res.status(400).json({ message: 'Credito insufficiente' });
    }
    utente.credito -= importo;
    await utente.save();
    const pagamento = await Pagamento.create({ uuidPagamento, importo, utenteId });
    res.status(200).json({ message: 'Pagamento effettuato', pagamento });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel pagamento', error });
  }
};
