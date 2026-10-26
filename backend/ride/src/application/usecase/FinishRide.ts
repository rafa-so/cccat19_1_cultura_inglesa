import { RideRepository } from "../../infra/repository/RideRepository";
import Position from "../../domain/entity/Position";
import { PositionRepositoryDatabase } from "../../infra/repository/PositionRepository";
 
export default class FinishRide {
    constructor(readonly rideRepository: RideRepository, readonly positionRepository: PositionRepositoryDatabase) {}

    async execute(input: Input) {
        const ride = await this.rideRepository.getRideById(input.rideId);
        const positions = await this.positionRepository.listByRideId(input.rideId);
        ride.finish(positions);
        await this.rideRepository.updateRide(ride);
    }
}

type Input = { rideId: string }