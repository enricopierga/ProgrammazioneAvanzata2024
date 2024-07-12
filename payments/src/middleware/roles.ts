import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { decodeJwt } from "../security/JWTservice";
type acceptedRoles = "Operatore" | "Automobilista" | "Varco";



/**
 * Middleware to validate JWT and optionally check for specific user role.
 *
 * @param requiredRole - The required user role to access the route (optional).
 * @returns The middleware function.
 */
export function requireAuthentication(
	requiredRoles?: acceptedRoles[]
) {
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
		//TODO: verificare con expired token

		if (requiredRoles !== undefined && requiredRoles.length > 0) {
			try {
				const decodedToken = decodeJwt(authorizationHeader);
				req.user = decodedToken;

				let hasValidRole = false;
				for (const role of requiredRoles) {

					if (decodedToken.role === role) {
						hasValidRole = true;
						break;
					}
				}
				if (hasValidRole === false) {
					return res.status(403).json({ message: "Forbidden" })

				}
				next();

			} catch (error) {
				return res
					.status(401)
					.json({ message: "Invalid or expired token" });
			}
		}
	};
}