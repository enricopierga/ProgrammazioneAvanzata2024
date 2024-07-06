import Pagamento from '../models/PaymentModel';

class PagamentoRepository {
  public async createPagamento(uuidPagamento: string, importo: number, utenteId: number): Promise<Pagamento> {
    return Pagamento.create({ uuidPagamento, importo, utenteId });
  }
}

export default new PagamentoRepository();
