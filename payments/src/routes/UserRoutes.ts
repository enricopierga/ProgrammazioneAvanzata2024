import { Router } from "express";
import UserController from "../controllers/UserController";
import {
	authenticateJWT,
	authorizeOperatore,
	authorizeAutomobilista,
} from "../middleware/roles";

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
	authenticateJWT,
	authorizeOperatore,
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
	"/:id/credit",
	authenticateJWT,
	authorizeAutomobilista,
	UserController.getCredit
);

router.post(
	"/login",
	UserController.login
);


export default router;
