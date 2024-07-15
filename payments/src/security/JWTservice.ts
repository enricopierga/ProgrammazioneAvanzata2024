import jwt from "jsonwebtoken";

interface JwtPayload {
	userId: number;
	role: "Admin" | "Operatore" | "Automobilista" | "Varco";
}


declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}

/**
 * Extracts the token from the Bearer prefix, if present.
 *
 * @param bearer - The authorization string containing the JWT.
 * @returns The extracted JWT.
 */
function extractToken(bearer: string): string {
	const prefix = "Bearer ";
	if (bearer.startsWith(prefix)) {
		return bearer.slice(prefix.length);
	}
	return bearer;
}

/**
 * Decodes a JWT token.
 *
 * @param bearer - The authorization string containing the JWT.
 * @returns The decoded JWT object.
 */
export function decodeJwt(bearer: string): JwtPayload {
	const token = extractToken(bearer);
	return jwt.verify(token, process.env.JWT_PRIVATE_KEY as string) as JwtPayload;
}

/**
 * Generates a JWT token from a given payload.
 *
 * @param payload - The JWT payload containing userId and role.
 * @returns The generated JWT token.
 */
export function generateJwt(payload: JwtPayload): string {
	return jwt.sign(payload, process.env.JWT_PRIVATE_KEY as string, {
		expiresIn: "1h",
	});
}