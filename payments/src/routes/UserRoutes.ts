import { Router } from "express";
import UserController from "../controllers/UserController";
import { requireAuthentication } from "../middleware/roles";
import pdfController from "../controllers/pdfController";

const router = Router();

/**
 * @swagger
 * /user/{id}/credit:
 *   post:
 *     summary: Top up user's credit
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Credit topped up
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.patch("/:id/credit", requireAuthentication(["Operatore"]), UserController.addCredit);

/**
 * @swagger
 * /user/{id}/credit:
 *   get:
 *     summary: Get user's credit
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User credit retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 credit:
 *                   type: number
 *                   description: User's credit
 *                   example: 100.5
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/:id/credit", requireAuthentication(["Automobilista"]), UserController.getCredit);

router.get("/:id", requireAuthentication(["Automobilista"]), UserController.getMyInfractions);

router.post("/login", UserController.login);

router.get("/:id", requireAuthentication(["Automobilista"]), pdfController.generatePdf);


/*
// Endpoint per generare il PDF della multa
app.get('/generate-ticket', async (req: Request, res: Response) => {
	const ticketData: TicketData = {
	  firstName: 'John',
	  lastName: 'Doe',
	  amount: 150,
	  entryLocation: 'Main St',
	  exitLocation: 'Broadway',
	  expectedSpeed: 60,
	  actualSpeed: 80,
	  date: '2023-07-15',
	  paymentId: '123456789',
	  ticketId: '987654321',
	  plateNumber: 'ABC1234',
	};
  
	try {
	  const pdfBytes = await generateTicketPdf(ticketData);
	  res.setHeader('Content-Type', 'application/pdf');
	  res.setHeader('Content-Disposition', 'attachment; filename=ticket.pdf');
	  res.send(Buffer.from(pdfBytes));
	} catch (error) {
	  res.status(500).send('Errore durante la generazione del PDF');
	}
*/

export default router;
