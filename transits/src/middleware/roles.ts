import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { decodeJwt } from "../security/JWTservice";

/**
 * Middleware to validate JWT and optionally check for specific user role.
 *
 * @param requiredRole - The required user role to access the route (optional).
 * @returns The middleware function.
 */
export function requireAuthentication(requiredRole?: "Operatore" | "Automobilista" | "Varco") {
	return (
		req: Request & { user?: JwtPayload },
		res: Response,
		next: NextFunction
	) => {
		const authorizationHeader = req.headers.authorization;

		if (!authorizationHeader) {
			return res
				.status(401)
				.json({ message: "Authorization header missing" });
		}

		try {
			const decodedToken = decodeJwt(authorizationHeader);
			req.user = decodedToken;

			if (requiredRole && decodedToken.role !== requiredRole) {
				return res
					.status(403)
					.json({ message: "Forbidden: Insufficient role" });
			}

			next();
		} catch (error) {
			return res
				.status(401)
				.json({ message: "Invalid or expired token" });
		}
	};
}