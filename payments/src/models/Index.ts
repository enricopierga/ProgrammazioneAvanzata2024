import Gate from "./GateModel";
import Infraction from "./InfractionModel";
import Payment from "./PaymentModel";
import Route from "./RouteModel";
import Transit from "./TransitModel";
import User from "./UserModel";
import Vehicle from "./VehicleModel";

// Definisci le relazioni
User.hasMany(Vehicle, {
	foreignKey: "ownerId",
	as: "vehicles",
});

Vehicle.belongsTo(User, {
	foreignKey: "userId",
	targetKey: "id",
	as: "user",
});

export { Gate, Infraction, Payment, Route, Transit, User, Vehicle };
