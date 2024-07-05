import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Carica le variabili d'ambiente
dotenv.config();

/**
 * Middleware per autenticare l'utente tramite JWT.
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  // Estrae il token dall'intestazione della richiesta
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    // Verifica il token JWT
    const decoded = jwt.verify(token, secret);
    // Aggiunge l'utente decodificato all'oggetto richiesta
    (req as any).user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

/**
 * Middleware per autorizzare l'utente in base al ruolo.
 * @param role - Il ruolo richiesto per accedere alla rotta
 */
export const authorize
