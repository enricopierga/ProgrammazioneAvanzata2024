import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

// Carica le variabili d'ambiente dal file .env
dotenv.config();

// Configura Sequelize utilizzando le variabili d'ambiente
const sequelize = new Sequelize(
  process.env.DB_DATABASE as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql', // Specifica il dialect MySQL
  }
);

export default sequelize;
