import Gate from "../models/GateModel";
import Route from "../models/RouteModel";
import User from "../models/UserModel";
import Vehicle from "../models/VehicleModel";
import Transit from "../models/TransitModel";
import Infraction from "../models/InfractionModel";


export async function seed() {

	await User.create({
		id: 1,
		username: "pangolino",
		email: "kikopierga@gmail.com",
		password: "12345",
		credit: 50,
		role: "Operatore",
	});

	await User.create({
		id: 2,
		username: "filippo",
		email: "filippochampagne@gmail.com",
		password: "12345",
		credit: 100,
		role: "Automobilista",
	});

	await User.create({
		id: 3,
		username: "nevio",
		email: "neviolostirato@gmail.com",
		password: "stirato",
		credit: 0,
		role: "Admin",
	});

	await Gate.create({
		id: 1,
		location: "Location 1",
		description: "descrizione 1"
	});

	await Gate.create({
		id: 2,
		location: "Location 2",
		description: "descrizione 2"
	});

	await Gate.create({
		id: 3,
		location: "Location 3",
		description: "descrizione 3"
	});

	await Gate.create({
		id: 4,
		location: "Location 4",
		description: "descrizione 4"
	});

	await Route.create({
		id: 1,
		startGateId: 1,
		endGateId: 2,
		distance: 2000,
	});

	await Route.create({
		id: 2,
		startGateId: 3,
		endGateId: 4,
		distance: 5000,
	});

	await Vehicle.create({
		id: 1,
		licensePlate: "AA123BB",
		type: "Car",
		userId: 1,
	});

	await Vehicle.create({
		id: 2,
		licensePlate: "BB123CC",
		type: "Truck",
		userId: 2,
	});

	await Transit.create({
		id: 1,
		vehicleId: 1,
		routeId: 2,
		travelTime: 70,
		weather: "Clear",
	});

	await Transit.create({
		id: 2,
		vehicleId: 1,
		routeId: 2,
		travelTime: 150,
		weather: "Rainy",
	});

	await Transit.create({
		id: 3,
		vehicleId: 1,
		routeId: 2,
		travelTime: 600,
		weather: "Clear",
	});

	await Infraction.create({
		paid: false,
		id: 1,
		vehicleId: 2,
		routeId: 2,
		userId: 1,
		speed: 198,
		limit: 80,
		weather: "rainy",
		timestamp: new Date(),
		amount: 150,
		uuid: "6836178f-0c78-4c10-88ec-75bae54fd6a4",
	});

	await Infraction.create({
		paid: false,
		id: 2,
		vehicleId: 2,
		routeId: 2,
		userId: 2,
		speed: 198,
		limit: 80,
		weather: "rainy",
		timestamp: new Date(),
		amount: 150,
		uuid: "6836178f-0c79-4c10-88ec-75bae54fd6a4",
	});
}

