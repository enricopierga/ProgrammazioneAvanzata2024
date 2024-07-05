import { Request, Response } from 'express';
import Utente from '../models/User';

export const ricaricaCredito = async (req: Request, res: Response) => {
  const { utenteId, importo } = req.body;
  try {
    const utente = await Utente.findByPk(utenteId);
    if (!utente) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    utente.credito += importo;
    await utente.save();
    res.status(200).json({ message: 'Credito ricaricato', credito: utente.credito });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel ricaricare il credito', error });
  }
};

export const getCredito = async (req: Request, res: Response) => {
  const { utenteId } = req.params;
  try {
    const utente = await Utente.findByPk(utenteId);
    if (!utente) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    res.status(200).json({ credito: utente.credito });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recuperare il credito', error });
  }
};
