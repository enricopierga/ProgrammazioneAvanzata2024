import { Request, Response } from "express";
import InfractionRepository from "../repositories/InfractionRepository";
import UserRepository from "../repositories/UserRepository";
import User from "../models/UserModel";
import Infraction from "../models/InfractionModel";
import VehicleRepository from "../repositories/VehicleRepository";
import Vehicle from "../models/VehicleModel";

class PaymentController {

	async payInfractionByUuid(req: Request, res: Response): Promise<void> {
		try {
			const { uuid } = req.body;
			console.log(uuid);
			// Trova l'infrazione associata tramite UUID

			const infraction = await InfractionRepository.getByUuid(
				uuid
			);

			if (!infraction) {
				res.status(404).json({ message: "Infraction not found" });
				return;
			}

			// Assicurarsi che l'infrazione non sia già stata pagata
			if (infraction.paid) {
				res.status(400).json({ message: "Fine already paid" });
				return;
			}

			// Aggiorna lo stato dell'infrazione come pagata
			infraction.paid = true;

			//Provo a trovare il veicolo associato alla multa
			const fineVehicle = await VehicleRepository.getById(infraction.vehicleId);

			//Trovo lo userId associato al veicolo in multa
			if (fineVehicle) {
				const fineUserId = fineVehicle.userId;

				const fineAmount = infraction.amount;
				await InfractionRepository.update(infraction.id, infraction);
				await UserRepository.updateUserCredit(fineUserId, fineAmount);

				res.status(200).json({
					message: "Fine paid successfully",
					infraction,
				});
			}
			else res.status(404).json({ message: "Vehicle not found" })






		} catch (error) {
			res.status(500).json({ message: "Internal server error", error });
		}
	}


}

export default new PaymentController();
