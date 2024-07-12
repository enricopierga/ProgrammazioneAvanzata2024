import Payment from '../models/PaymentModel';

class PaymentRepository {


  
  // Creazione di un nuovo pagamento
  async createPayment(data: Partial<Payment>): Promise<Payment> {
    const payment = await Payment.create(data);
    return payment;
  }

  // Recupero di un pagamento tramite ID
  async getPaymentById(id: number): Promise<Payment | null> {
    const payment = await Payment.findByPk(id);
    return payment;
  }

  // Recupero di tutti i pagamenti di un utente
  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    const payments = await Payment.findAll({
      where: { userId },
    });
    return payments;
  }

  // Aggiornamento di un pagamento
  async updatePayment(id: number, data: Partial<Payment>): Promise<[number, Payment[]]> {
    const [numberOfAffectedRows, affectedRows] = await Payment..update(data, {
      where: { id },
      returning: true,
    });
    return [numberOfAffectedRows, affectedRows];
  }

  // Eliminazione di un pagamento
  async deletePayment(id: number): Promise<number> {
    const numberOfDeletedRows = await Payment.destroy({
      where: { id },
    });
    return numberOfDeletedRows;
  }
}

export default new PaymentRepository();
