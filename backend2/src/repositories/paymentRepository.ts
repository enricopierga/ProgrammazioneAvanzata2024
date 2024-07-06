import Pagamento from '../models/Payment';

class PagamentoRepository {
  public async createPagamento(uuidPagamento: string, importo: number, utenteId: number): Promise<Pagamento> {
    return Pagamento.create({ uuidPagamento, importo, utenteId });
  }
}

export default new PagamentoRepository();
