// src/routes/transitRoutes.ts
import { Router } from 'express';
import TransitController from '../controllers/TransitController';

const router = Router();

router.post('/transits', TransitController.create);
router.get('/transits', TransitController.getAll);
router.get('/transits/:id', TransitController.getById);
router.put('/transits/:id', TransitController.update);
router.delete('/transits/:id', TransitController.delete);

export default router;

/*
    Metodo: POST
	URL: /transits
	Body:
    {
        "vehicleId": 1,
        "routeId": 1,
        "travelTime": 3600,
        "weather": "clear"
    }

    Metodo: GET
	URL: /transits
	Body: Nessun body richiesto.

    Metodo: GET
	URL: /transits/:id
	Body: Nessun body richiesto.

    Metodo: PUT
	URL: /transits/:id
	Body:
    {
      "vehicleId": 1,
      "routeId": 1,
      "travelTime": 4000,
      "weather": "rainy"
    }

    Metodo: DELETE
	URL: /transits/:id
	Body: Nessun body richiesto.
*/