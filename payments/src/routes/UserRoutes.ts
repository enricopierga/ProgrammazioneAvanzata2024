import { Router } from "express";
import * as userController from "../controllers/userController";
import {
	authenticateJWT,
	authorizeOperatore,
	authorizeAutomobilista,
} from "../middleware/roles";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve the list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", userController.getUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retrieve a user by ID
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
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get("/:id", userController.getUser);

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
router.post(
	"/:id/credit",
	authenticateJWT,
	authorizeOperatore,
	userController.addCredit
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
	userController.getCredit
);

export default router;

// Rotta che consente 
