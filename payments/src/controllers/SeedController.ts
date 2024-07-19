import { seed } from "../utils/dbPaymentsSeed";
import { Request, Response } from "express"; // Import Request and Response types from Express
import { StatusCodes } from "http-status-codes"; // Import HTTP status codes and reason phrases

class SeedController {
  popolate = async (req: Request, res: Response) => {
    if (process.env.IS_DEMO! !== "true") {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }
    await seed();
    res.status(StatusCodes.OK).send();
  };
}
export default new SeedController(); // Export an instance of UserController
