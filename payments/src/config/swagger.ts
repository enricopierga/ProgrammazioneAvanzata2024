import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { swaggerDocument } from "./swaggerTypes"; // Assicurati di avere il percorso corretto

const createSwaggerSpec = (port: number | string) => {
	const options: swaggerJsdoc.Options = {
		definition: {
			...swaggerDocument,
			servers: [
				{
					url: `http://localhost:${port}`, // Usa la porta passata come parametro
				},
			],
		},
		apis: ["./src/routes/*.ts"], // Percorso ai file delle rotte
	};

	return swaggerJsdoc(options);
};

export function setupSwagger(app: Express, port: number | string): void {
	const specs = createSwaggerSpec(port);
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}
