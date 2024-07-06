// src/app.ts
import express from 'express';
import vehicleRoutes from './routes/vehicleRoutes';
import { sequelize } from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', vehicleRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});