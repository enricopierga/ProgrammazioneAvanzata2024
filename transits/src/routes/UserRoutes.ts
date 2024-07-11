import { Router } from "express";
import UserController from "../controllers/UserController";
import {requireAuthentication} from "../middleware/roles";

const router = Router();

router.patch("/:id/credit", requireAuthentication("Operatore"), UserController.addCredit);
router.get("/:id/credit", requireAuthentication("Automobilista"), UserController.getCredit);
router.post("/login", UserController.login);


export default router;
