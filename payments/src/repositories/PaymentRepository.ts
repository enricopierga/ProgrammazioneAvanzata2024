import Payment from '../models/PaymentModel';
import { getUserById, updateUserCredits } from '../models/UserModel';
import { getMultaById } from '../models/InfractionsModel';

class PaymentRepository {
  // Creazione di un nuovo pagamento e scalare i crediti dell'utente
  async createPayment(userId: string, infractionId: string): Promise<Payment | string> {
    const user = await getUserById(userId);
    const multa = await getMultaById(infractionId);

    if (!user) {
      throw new Error('Utente non trovato');
    }

    if (!multa) {
      throw new Error('Multa non trovata');
    }

    if (user.credits < multa.amount) {
      throw new Error('Crediti insufficienti');
    }

    // Scala i crediti dell'utente
    await updateUserCredits(userId, user.credits - multa.amount);

    // Crea un nuovo pagamento
    const payment = await Payment.create({
      userId,
      infractionId,
      amount: multa.amount,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return payment;
  }

  // Ottenere un pagamento per ID
  async getPaymentById(id: number): Promise<Payment | null> {
    const payment = await Payment.findByPk(id);
    return payment;
  }

  // Ottenere tutti i pagamenti di un utente
  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    const payments = await Payment.findAll({
      where: {
        userId,
      },
    });
    return payments;
  }

  // Aggiornare un pagamento
  async updatePayment(id: number, updates: Partial<Payment>): Promise<[number, Payment[]]> {
    const [numberOfAffectedRows, affectedRows] = await Payment.update(updates, {
      where: { id },
      returning: true,
    });
    return [numberOfAffectedRows, affectedRows];
  }

  // Eliminare un pagamento
  async deletePayment(id: number): Promise<number> {
    const numberOfDeletedRows = await Payment.destroy({
      where: { id },
    });
    return numberOfDeletedRows;
  }
}

export default PaymentRepository;
