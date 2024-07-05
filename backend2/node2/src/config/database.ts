import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
const config = require('./config.json');

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
});

export default sequelize;