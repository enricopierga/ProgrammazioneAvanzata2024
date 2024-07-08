/*
 * Controller per effettuare un pagamento.
 */
import { Request, Response } from 'express';
import PaymentRepository from '../repositories/PaymentRepository';
import Infraction from '../models/InfractionsModel';


const paymentRepository = new PaymentRepository();

// ????????????????????? ha senso ????????????????????

export const effettuaPagamento = async (req: Request, res: Response) => {
  const { userId, infractionId } = req.body;

  try {
    const payment = await paymentRepository.createPayment(userId, infractionId);
    res.send(`Pagamento effettuato con successo, ID pagamento: ${payment.id}`);
  } catch (error) {
    console.error('Errore nel pagamento:', error);
    res.status(400).send(`Errore nel pagamento: ${error.message}`);
  }
};




