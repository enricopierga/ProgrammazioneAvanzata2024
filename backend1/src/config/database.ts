
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('yourdb', 'youruser', 'yourpassword', {
  host: 'db',
  dialect: 'postgres',
});

export default sequelize;
