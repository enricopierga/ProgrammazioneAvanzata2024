import Utente from '../models/UserModel';

class UtenteRepository {
  public async findById(utenteId: number): Promise<Utente | null> {
    return Utente.findByPk(utenteId);
  }

  public async addCredito(utenteId: number, importo: number): Promise<Utente | null> {
    const utente = await this.findById(utenteId);
    if (utente) {
      utente.credito += importo;
      await utente.save();
    }
    return utente;
  }

  public async getCredito(utenteId: number): Promise<number | null> {
    const utente = await this.findById(utenteId);
    return utente ? utente.credito : null;
  }
}

export default new UtenteRepository();
