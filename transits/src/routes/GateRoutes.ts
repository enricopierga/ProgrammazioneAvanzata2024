// src/routes/gateRoutes.ts
import { Router } from 'express';
import GateController from '../controllers/GateController';

const router = Router();

router.post('/gates', GateController.create);
router.get('/gates', GateController.getAll);
router.get('/gates/:id', GateController.getById);
router.put('/gates/:id', GateController.update);
router.delete('/gates/:id', GateController.delete);

export default router;

/*
	Metodo: POST
	URL: /gates
    Body:
    {
         "location": "Example Location"
    }

    Metodo: GET
	URL: /gates
	Body: Nessun body richiesto.

    Metodo: GET
	URL: /gates/:id
	Body: Nessun body richiesto.

    Metodo: PUT
	URL: /gates/:id
    Body: 
    {
      "location": "Updated Location"
    }

    Metodo: DELETE
	URL: /gates/:id
	Body: Nessun body richiesto.

*/