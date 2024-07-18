import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { decodeJwt } from "../security/JWTservice";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

type acceptedRoles = "Admin" | "Operatore" | "Automobilista" | "Varco";

/**
 * Middleware to validate JWT and optionally check for specific user role.
 * @param requiredRole - The required user role to access the route (optional).
 * @returns The middleware function.
 */
export function requireAuthentication(requiredRoles?: acceptedRoles[]) {
  return (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: ReasonPhrases.UNAUTHORIZED });
    }

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
          return res
            .status(StatusCodes.FORBIDDEN)
            .json({ message: ReasonPhrases.FORBIDDEN });
        }
        next();
      } catch (error) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: ReasonPhrases.UNAUTHORIZED });
      }
    }
  };
}
