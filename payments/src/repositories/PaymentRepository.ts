import Payment from '../models/PaymentModel';

class PaymentRepository {

// Creazione di un nuovo pagamento
  async createPayment(data: any): Promise<Payment> {
    const payment = await Payment.create(data);
    return payment;
  }

}
export default new PaymentRepository();
