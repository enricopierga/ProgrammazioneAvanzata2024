import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { decodeJwt } from "../security/JWTservice";


/**
 * Middleware to validate JWT and optionally check for specific user role.
 *
 * @param requiredRole - The required user role to access the route (optional).
 * @returns The middleware function.
 */
export function requireAuthentication(
	requiredRole?: "Operatore" | "Automobilista" | "Varco"
) {
	return (
		req: Request & { user?: JwtPayload },
		res: Response,
		next: NextFunction
	) => {
		const authorizationHeader = req.headers.authorization;

		// Allow free access for Operatore, Automobilista, and Varco roles even with an empty body (tutti possono fare richieste GET)
		if (!authorizationHeader) {
			if (requiredRole === "Operatore" || requiredRole === "Automobilista" || requiredRole === "Varco") {
				return next();
			} else {
				return res.status(401).json({ message: "Authorization header missing" });
			}
		}


		try {
			const decodedToken = decodeJwt(authorizationHeader);
			req.user = decodedToken;

			// Prevent Automobilista or Varco from performing Operatore operations
			if ((decodedToken.role === "Automobilista" || decodedToken.role === "Varco") && requiredRole === "Operatore") {
				return res.status(403).json({ message: "Forbidden: Insufficient role" });
			}

			// If a specific role is required, check the user's role
			if (requiredRole && decodedToken.role !== requiredRole) {
				return res.status(403).json({ message: "Forbidden: Insufficient role" });
			}

			next();
		} catch (error) {
			return res.status(401).json({ message: "Invalid or expired token" });
		}
	};
}


