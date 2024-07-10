// src/routes/infractionRoutes.ts
import { Router } from 'express';
import InfractionController from '../controllers/InfractionController';
//import { authenticateJWT, authorizeAutomobilista, authorizeOperatore } from "../middleware/roles";



const router = Router();

router.post('/infractions', InfractionController.create);
//router.get('/infractions', InfractionController.getAll);
//router.get('/infractions/:id', InfractionController.getById);
//router.put('/infractions/:id', InfractionController.update);
//router.delete('/infractions/:id', InfractionController.delete);
router.get('/infractions/by-plates-and-period', InfractionController.getInfractionsByPlatesAndPeriod);
//router.get('/infractions/:id/download', InfractionController.generatePaymentSlip);


// Rotta per scaricare il bollettino di pagamento della multa in formato PDF
/*router.post(
    '/infractions/bollettino',
    authenticateJWT,
    authorizeAutomobilista,
    InfractionController.generaBollettino
);*/

export default router;