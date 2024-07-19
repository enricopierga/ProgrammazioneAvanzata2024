import Payment from '../models/PaymentModel';

class PaymentRepository {

// Create a new payment
  async createPayment(data: any): Promise<Payment> {
    const payment = await Payment.create(data);
    return payment;
  }
}

export default new PaymentRepository();