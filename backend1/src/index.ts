
import express from 'express';
import sequelize from './config/database';
import Vehicle from './models/Vehicle';

const app = express();
const port = 3000;

const start = async () => {
  try {
    await sequelize.sync();
    console.log('Database & tables created!');
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

start();
