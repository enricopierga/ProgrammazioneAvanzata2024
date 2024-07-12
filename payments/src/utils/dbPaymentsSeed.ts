import Gate from "../models/GateModel";
import Route from "../models/RouteModel";
import User from "../models/UserModel";
import Vehicle from "../models/VehicleModel";
import Transit from "../models/TransitModel";
import Infraction from "../models/InfractionModel";


export function seed() {
	if (process.env.CLEAN_DB !== "true") return;

	User.create({
		id: 1,
		username: "pangolino",
		email: "kikopierga@gmail.com",
		password: "12345",
		credit: 100,
		role: "Operatore",
	});

	User.create({
		id: 2,
		username: "filippo",
		email: "filippochampagne@gmail.com",
		password: "poveri",
		credit: 1000,
		role: "Automobilista",
	});

	Gate.create({
		id: 1,
		location: "Location 1",
		description: "descrizione 1"
	});

	Gate.create({
		id: 2,
		location: "Location 2",
		description: "descrizione 2"
	});

	Gate.create({
		id: 3,
		location: "Location 3",
		description: "descrizione 3"
	});

	Gate.create({
		id: 4,
		location: "Location 4",
		description: "descrizione 4"
	});

	Route.create({
		id: 1,
		startGateId: 1,
		endGateId: 2,
		distance: 2000,
	});

	Route.create({
		id: 2,
		startGateId: 3,
		endGateId: 4,
		distance: 5000,
	});

	Vehicle.create({
		id: 1,
		licensePlate: "AA123BB",
		type: "Car",
		userId: 1,
	});

	Vehicle.create({
		id: 2,
		licensePlate: "BB123CC",
		type: "Truck",
		userId: 2,
	});

	Transit.create({
		id: 1,
		vehicleId: 1,
		routeId: 2,
		travelTime: 70,
		weather: "clear",
	});

	Transit.create({
		id: 2,
		vehicleId: 1,
		routeId: 2,
		travelTime: 150,
		weather: "rainy",
	});

	Transit.create({
		id: 3,
		vehicleId: 1,
		routeId: 2,
		travelTime: 600,
		weather: "clear",
	});

	Infraction.create({
		paid: false,
		id: 1,
		vehicleId: 1,
		routeId: 2,
		speed: 198,
		limit: 80,
		weather: "rainy",
		timestamp: new Date(),
		amount: 150,
		uuid: "6836178f-0c78-4c10-88ec-75bae54fd6a4",
	});

	Infraction.create({
		paid: false,
		id: 2,
		vehicleId: 1,
		routeId: 2,
		speed: 198,
		limit: 80,
		weather: "rainy",
		timestamp: new Date(),
		amount: 150,
		uuid: "6836178f-0c79-4c10-88ec-75bae54fd6a4",
	});
}

