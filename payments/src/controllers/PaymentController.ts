import { Request, Response } from "express";
import InfractionRepository from "../repositories/InfractionRepository";
import UserRepository from "../repositories/UserRepository";

class PaymentController {

	async payInfractionByUuid(req: Request, res: Response): Promise<void> {
		const { uuid } = req.body;
		const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		if (!regex.test(uuid)) {
			res.status(400).json({ message: 'Invalid UUID format' });
			return;
		}

		const infraction = await InfractionRepository.getByUuid(uuid);

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

		infraction.paid = true;

		await UserRepository.decreaseCredit(req.user!.userId, fineAmount);

		res.status(200).json({ message: "Fine paid successfully", infraction });
	}
};

export default new PaymentController();
