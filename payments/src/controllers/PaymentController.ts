import { Request, Response } from "express";
import InfractionRepository from "../repositories/InfractionRepository";
import UserRepository from "../repositories/UserRepository";
import User from "../models/UserModel";
import Infraction from "../models/InfractionModel";
import VehicleRepository from "../repositories/VehicleRepository";
import Vehicle from "../models/VehicleModel";

class PaymentController {

	async payInfractionByUuid(req: Request, res: Response): Promise<void> {

		const { uuid } = req.body;
		console.log(uuid);
		// Trova l'infrazione associata tramite UUID

		//TODO: check uuid format in order to prevent user's query
		const infraction = await InfractionRepository.getByUuid(
			uuid
		);

		if (!infraction) {
			res.status(404).json({ message: "Infraction not found" });
			return;
		}

		if (infraction.userId !== req.user!.userId) {
			res.status(404).json({ message: "Infraction not found" })
			return;
		}

		if (infraction.paid) {
			res.status(400).json({ message: "Fine already paid" });
			return;
		}

		const fineAmount = infraction.amount;

		const updated = await InfractionRepository.markAsPaid(infraction);
		if (!updated) {
			res.status(500).json({ message: "There was an error updating the infraction" })
			return;
		}

		await UserRepository.decreaseCredit(req.user!.userId, fineAmount);

		res.status(200).json({
			message: "Fine paid successfully",
			infraction,
		});
	}


};


export default new PaymentController();
