import { Router } from "express";
import { requireAuthentication } from "../middlewares/authenticationMiddleware";

import UserController from "../controllers/UserController";
import PdfController from "../controllers/FinePdfController";
import FinePdfController from "../controllers/FinePdfController";

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
router.patch(
  "/:id/credit",
  requireAuthentication(["Admin"]),
  UserController.addCredit
);

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
router.get(
  "/credit",
  requireAuthentication(["Automobilista", "Operatore"]),
  UserController.getCredit
);

router.get(
  "/myInfraction",
  requireAuthentication(["Automobilista", "Operatore"]),
  UserController.getMyInfractions
);

router.post("/login", UserController.login);

router.get(
  "/:id/pdf",
  requireAuthentication(["Automobilista", "Operatore"]),
  FinePdfController.getPdf
);

export default router;
