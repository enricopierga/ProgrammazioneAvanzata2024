import Gate from "./GateModel";
import Infraction from "./InfractionModel";
import Payment from "./PaymentModel";
import Route from "./RouteModel";
import Transit from "./TransitModel";
import User from "./UserModel";
import Vehicle from "./VehicleModel";

// Route <-> Gate
//Route.belongsTo(Gate, { as: 'startGate', foreignKey: 'startGateId', targetKey: "id",});
//Route.belongsTo(Gate, { as: 'endGate', foreignKey: 'endGateId', targetKey: "id",});

// Infraction <-> Vehicle
//Infraction.belongsTo(Vehicle, { as: 'vehicle', foreignKey: 'vehicleId', targetKey: "id",});

// Infraction <-> Route
//Infraction.belongsTo(Route, { as: 'route', foreignKey: 'routeId', targetKey: "id",});

// Vehicle <-> User
//Vehicle.belongsTo(User, { as: 'owner', foreignKey: 'ownerId', targetKey: "id",});
//User.hasMany(Vehicle, { as: "vehicles", foreignKey: "ownerId",});

//export { Gate, Infraction, Payment, Route, Transit, User, Vehicle };
