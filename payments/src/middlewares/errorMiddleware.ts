import { Request, Response, NextFunction } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

// CustomError interface extends Error and optionally includes statusCode.
interface CustomError extends Error {
  statusCode?: number;
}

// Error-handling middleware function.
const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack); // Log the error stack.

  // Respond with a 500 Internal Server Error.
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
};

// Export the errorHandler function.
export { errorHandler };
