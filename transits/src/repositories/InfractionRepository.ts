import { Op } from "sequelize";
import Infraction from "../models/InfractionModel";
import Vehicle from "../models/VehicleModel";
import Route from "../models/RouteModel";
import Gate from "../models/GateModel";
import { v4 as UUIDV4 } from "uuid";

interface InfractionResult {
  plate: string;
  type: string;
  route: {
    inGate: string;
    outGate: string;
    distance: number;
  };
  averageSpeed: number;
  limitSpeed: number;
  speedDelta: number;
  weather: string;
  datetime: Date;
}

class InfractionRepository {
  async create(data: any): Promise<Infraction> {
    data.uuid = UUIDV4();
    return await Infraction.create(data);
  }

  async getInfractionsByUserId(userId: number): Promise<Infraction[]> {
    return await Infraction.findAll({
      where: { userId },
    });
  }

  // Method to fetch infractions by license plates and date period
  async getByPlatesAndPeriod(
    plates: string[],
    startDate: string,
    endDate: string,
    isOperator: boolean,
    userId: number
  ): Promise<InfractionResult[]> {
    // Constructing the where clause for the query
    const whereClause: any = {
      timestamp: { [Op.between]: [new Date(startDate), new Date(endDate)] },
    }; // = WHERE timestamp BETWEEN startDate AND endDate

    // If the user is not an operator, add a userId filter to the where clause
    if (!isOperator) {
      whereClause.userId = userId;
    }

    // Fetch infractions from the database with the specified filters
    const infractions = await Infraction.findAll({
      where: whereClause,
      include: [
        {
          model: Vehicle,
          as: "vehicle",
          attributes: ["licensePlate", "type"],
          where: { licensePlate: { [Op.in]: plates } }, // = WHERE licensePlate IN plates
        },
        {
          model: Route,
          as: "route",
          attributes: ["distance"],
          include: [
            { model: Gate, as: "startGate", attributes: ["location"] },
            { model: Gate, as: "endGate", attributes: ["location"] },
          ],
        },
      ],
    });

    // Transform the infractions data to match the InfractionResult interface
    return infractions.map((infraction: any) => ({
      plate: infraction.vehicle.licensePlate,
      type: infraction.vehicle.type,
      route: {
        inGate: infraction.route.startGate.location,
        outGate: infraction.route.endGate.location,
        distance: infraction.route.distance,
      },
      averageSpeed: infraction.speed,
      limitSpeed: infraction.limit,
      speedDelta: infraction.speed - infraction.limit,
      weather: infraction.weather,
      amount: infraction.amount,
      uuid: infraction.uuid,
      datetime: infraction.timestamp,
    }));
  }

  async getById(id: number): Promise<Infraction | null> {
    return await Infraction.findByPk(id);
  }

  async getByUuid(uuid: string): Promise<Infraction | null> {
    return await Infraction.findOne({ where: { uuid } });
  }

  async markAsPaid(data: Infraction): Promise<boolean> {
    const [affectedCount] = await Infraction.update(
      { paid: true },
      {
        where: { id: data.id },
      }
    );
    return affectedCount === 1;
  }

  async update(id: number, data: any): Promise<number> {
    const [updated] = await Infraction.update(data, {
      where: { id },
    });
    return updated;
  }
}

export default new InfractionRepository();
