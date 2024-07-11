import express from "express";
import sequelize from "./config/database";
import dotenv from "dotenv";

import "./models/Index";

// Load environment variables from .env file
dotenv.config();

// Middlewares and configurations
import { errorHandler } from "./middleware/errorHandler";
import { setupSwagger } from "./config/swagger";

// Routes
import gateRoutes from "./routes/GateRoutes";
import infractionRoutes from "./routes/InfractionRoutes";
import routeRoutes from "./routes/RouteRoutes";
import transitRoutes from "./routes/TransitRoutes";
import vehicleRoutes from "./routes/VehicleRoutes"
import User from "./models/UserModel";
import { seed as dbSeed } from "./utils/dbSeed";
import userRoutes from "./routes/UserRoutes";


// Initialize Express application
const app = express();
const port = process.env.PORT || 3001;

// Setup Swagger API documentation
setupSwagger(app, port);

// Middleware to parse JSON requests
app.use(express.json());

// Error handling middleware
app.use(errorHandler);

// Define routes
app.use("/gate", gateRoutes); // Gate-related routes
app.use("/route", routeRoutes); // Route-related routes
app.use("/vehicle", vehicleRoutes); // Transit-related routes
app.use("/transit", transitRoutes); // Transit-related routes
app.use("/infraction", infractionRoutes); // Infraction-related routes


app.use("/user", userRoutes); // User-related routes


const initializeDb = process.env.CLEAN_DB === "true";

// Prepare db and start listener
sequelize
	.sync({ force: initializeDb }) // Usa force: true solo in sviluppo, cancella e ricrea le tabelle
	.then(() => {
		if (initializeDb)
			User.create({
				id: 1,
				username: "pangolino",
				email: "kikopierga@gmail.com",
				password: "12345",
				credit: 100,
				role: "Operatore"
			});

		console.log("Database synced");
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	})
	.catch((error) => {
		console.error("Unable to connect to the database:", error);
	});
