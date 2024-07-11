import { Request, Response } from "express";
import InfractionRepository from "../repositories/InfractionRepository";

class PaymentController {

	async getInfraction(req: Request, res: Response): Promise<void> {

		if(req.query.infractionId){
			const infractionId = Number(req.query.infractionId);

		    if (isNaN(infractionId)) {
			    res.status(400).json({ message: "Invalid ID format" });
			    return;
		    }

		    const transit = await InfractionRepository.getById(infractionId);
		    if (transit) {
			    res.status(200).json(transit);
		    } else {
			    res.status(404).json({ message: "Transit not found" });
	     	}
		}

		else {
			const infractions = await InfractionRepository.getAll();
		    res.status(200).json(infractions);
		}
		
	}
	async payInfractionByUuid(req: Request, res: Response): Promise<void> {
		try {
			const { uuidPayment } = req.body;

			// Trova l'infrazione associata tramite UUID
			const infraction = await InfractionRepository.getByUuid(
				uuidPayment
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
			await InfractionRepository.update(infraction.id, infraction);

			res.status(200).json({
				message: "Fine paid successfully",
				infraction,
			});
		} catch (error) {
			res.status(500).json({ message: "Internal server error", error });
		}
	}
	
}

export default new PaymentController();
