import { RideRepository } from "../../infra/repository/RideRepository";
import Position from "../../domain/entity/Position";
import { PositionRepositoryDatabase } from "../../infra/repository/PositionRepository";
import ProcessPayment from "./ProcessPayment";
import { TransactionRepositoryDatabase } from "../../infra/repository/TransactionRepository";
import { PgPromiseAdapter } from "../../infra/database/DatabaseConnection";
 
export default class FinishRide {
    constructor(readonly rideRepository: RideRepository, readonly positionRepository: PositionRepositoryDatabase) {}

    async execute(input: Input) {
        const ride = await this.rideRepository.getRideById(input.rideId);
        const positions = await this.positionRepository.listByRideId(input.rideId);
        ride.finish(positions);
        await this.rideRepository.updateRide(ride);

        const processPayment = new ProcessPayment(new TransactionRepositoryDatabase(new PgPromiseAdapter()));
        await processPayment.execute({ rideId: ride.getRideId(), amount: ride.getFare() });
    }
}

type Input = { rideId: string }