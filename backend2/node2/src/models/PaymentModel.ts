import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Utente from './UserModel';

// Definizione del modello Pagamento
class Pagamento extends Model {
  public id!: number;
  public uuidPagamento!: string;
  public importo!: number;
  public utenteId!: number;
}

Pagamento.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    uuidPagamento: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    importo: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    utenteId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: 'pagamenti',
    sequelize,
  }
);

Pagamento.belongsTo(Utente, { foreignKey: 'utenteId' });

export default Pagamento;
