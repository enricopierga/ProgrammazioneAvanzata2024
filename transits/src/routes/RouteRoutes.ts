// src/routes/routeRoutes.ts
import { Router } from 'express';
import RouteController from '../controllers/RouteController';

const router = Router();

router.post('/routes', RouteController.create);
router.get('/routes', RouteController.getAll);
router.get('/routes/:id', RouteController.getById);
router.put('/routes/:id', RouteController.update);
router.delete('/routes/:id', RouteController.delete);

export default router;

/*
    Metodo: POST
	URL: /routes
	Body:
    {
       "startGateId": 1,
       "endGateId": 2,
       "distance": 10.5
    }

    Metodo: GET
	URL: /routes
	Body: Nessun body richiesto.

    Metodo: GET
	URL: /routes/:id
	Body: Nessun body richiesto.

    Metodo: PUT
	URL: /routes/:id
	Body:
    {
      "startGateId": 1,
      "endGateId": 2,
      "distance": 12.0
    }

    Metodo: DELETE
	URL: /routes/:id
	Body: Nessun body richiesto.
*/