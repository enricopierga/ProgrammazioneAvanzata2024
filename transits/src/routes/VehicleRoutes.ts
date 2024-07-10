// src/routes/vehicleRoutes.ts c
import { Router } from 'express';
import VehicleController from '../controllers/VehicleController';

const router = Router();

router.post('/vehicles', VehicleController.create);
router.get('/vehicles', VehicleController.getAll);
router.get('/vehicles/:id', VehicleController.getById);
router.put('/vehicles/:id', VehicleController.update);
router.delete('/vehicles/:id', VehicleController.delete);

export default router;

/*
    Metodo: POST
	URL: /vehicles
	Body:
    {
      "licensePlate": "ABC123",
      "type": "car"
    }

    Metodo: GET
	URL: /vehicles
	Body: Nessun body richiesto.

    Metodo: GET
	URL: /vehicles/:id
	Body: Nessun body richiesto.

    Metodo: PUT
	URL: /vehicles/:id
	Body:
    {
      "licensePlate": "XYZ789",
      "type": "truck"
    }

    Metodo: DELETE
	URL: /vehicles/:id
	Body: Nessun body richiesto.
*/