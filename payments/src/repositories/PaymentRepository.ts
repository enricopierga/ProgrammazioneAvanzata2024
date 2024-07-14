import Payment from '../models/PaymentModel';



//TODO: Per ogni operazione, creare un pagamento ed utilizzare questa tabella come log di transazioni
class PaymentRepository {



  // Creazione di un nuovo pagamento
  async createPayment(data: Partial<Payment>): Promise<Payment> {
    const payment = await Payment.create(data);
    return payment;
  }

}
export default new PaymentRepository();
