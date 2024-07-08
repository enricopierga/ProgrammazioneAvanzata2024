export const swaggerDocument = {
	openapi: "3.0.0",
	info: {
		title: "Programmazione Avanzata - Payment Module",
		version: "1.0.0",
		description: "Qui si caccia il grano pesante",
	},
	components: {
		schemas: {
			User: {
				type: "object",
				required: ["name", "email", "credit"],
				properties: {
					id: {
						type: "integer",
						description: "User ID",
					},
					name: {
						type: "string",
						description: "User's name",
					},
					email: {
						type: "string",
						description: "User's email",
					},
					credit: {
						type: "integer",
						description: "User credit",
					},
				},
				example: {
					id: 1,
					name: "Mario Rossi",
					email: "mario.rossi@example.com",
					credit: 100,
				},
			},
		},
	},
};
