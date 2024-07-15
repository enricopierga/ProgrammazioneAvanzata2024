// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "An unexpected error occurred";

  res.status(statusCode).json({ status: "error", statusCode, message });
};

export { errorHandler };
