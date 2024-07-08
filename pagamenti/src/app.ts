import express from "express";
import sequelize from "./config/database";
import utenteRoutes from "./routes/UserRoutes";
import pagamentoRoutes from "./routes/PaymentRoutes";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Usa le rotte
app.use("/utente", utenteRoutes);
app.use("/pagamento", pagamentoRoutes);

// Middleware per la gestione degli errori
app.use(errorHandler);

// Funzione di avvio del server
app.listen(port, async () => {
	console.log(`Server is running on port ${port}`);
	try {
		await sequelize.sync();
		console.log("Database connected successfully");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
});
