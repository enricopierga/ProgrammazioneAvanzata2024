import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../../data/transits.sqlite'  // Risale di due cartelle rispetto a config/database.ts
});

export default sequelize;
