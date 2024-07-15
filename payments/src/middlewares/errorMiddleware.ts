// middleware/errorHandler.ts
//TODO: lib status codes
import { Request, Response, NextFunction } from "express";
import {
	ReasonPhrases,
	StatusCodes,
} from 'http-status-codes';

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

	return res
		.status(StatusCodes.INTERNAL_SERVER_ERROR)
		.send(ReasonPhrases.INTERNAL_SERVER_ERROR);

};

export { errorHandler };
