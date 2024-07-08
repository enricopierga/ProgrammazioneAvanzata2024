import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Carica le variabili d'ambiente
dotenv.config();

/**
 * Middleware per autenticare l'utente tramite JWT.
 */
export const authenticateJWT = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Estrae il token dall'intestazione della richiesta
	const token = req.header("Authorization")?.split(" ")[1];

	if (!token) {
		return res
			.status(403)
			.json({ message: "Access denied. No token provided." });
	}

	try {
		const secret = process.env.JWT_SECRET as string;
		// Verifica il token JWT
		const decoded = jwt.verify(token, secret);
		// Aggiunge l'utente decodificato all'oggetto richiesta
		(req as any).user = decoded;
		next();
	} catch (ex) {
		res.status(400).json({ message: "Invalid token." });
	}
};

/**
 * Middleware per autorizzare l'automobilitsta
 */
export const authorizeAutomobilista = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// TODO: Per ora non faccio nulla, da capire l'implementazione
	next();
};

/**
 * Middleware per autorizzare l'operatore
 */
export const authorizeOperatore = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// TODO: Per ora non faccio nulla, da capire l'implementazione
	next();
};
