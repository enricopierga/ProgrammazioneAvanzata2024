import express from 'express';
import sequelize from './config/database';
import utenteRoutes from './routes/UserRoutes';
import pagamentoRoutes from './routes/PaymentRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Usa le rotte
app.use('/utente', utenteRoutes);
app.use('/pagamento', pagamentoRoutes);

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await sequelize.sync();
});
