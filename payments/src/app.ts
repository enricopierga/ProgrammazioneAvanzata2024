import express from "express";
import sequelize from "./config/database";
import dotenv from "dotenv";

import "./models/Index";

// Load environment variables from .env file
dotenv.config();

// Middlewares and configurations
import { errorHandler } from "./middlewares/errorMiddleware";
import { setupSwagger } from "./config/swagger";

// Routes
import userRoutes from "./routes/UserRoutes";
import paymentRoutes from "./routes/PaymentRoutes";
import SeedRoutes from "./routes/SeedRoutes";

// Initialize Express application
const app = express();
const port = process.env.PORT || 3000;

// Setup Swagger API documentation
setupSwagger(app, port);

// Middleware to parse JSON requests
app.use(express.json());

// Error handling middleware
app.use(errorHandler);

// Define routes
app.use("/user", userRoutes); // User-related routes
app.use("/payments", paymentRoutes); // Payment-related routes
app.use("/seeds", SeedRoutes);

const initializeDb = process.env.CLEAN_DB === "true";

// Prepare db and start listener
sequelize
  .sync({ force: initializeDb }) // Usa force: true solo in sviluppo, cancella e ricrea le tabelle
  .then(async () => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
