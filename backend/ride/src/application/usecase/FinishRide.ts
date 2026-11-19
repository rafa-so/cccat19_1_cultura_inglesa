import { RideRepository } from "../../infra/repository/RideRepository";
import { PositionRepositoryDatabase } from "../../infra/repository/PositionRepository";
import Mediator from "../../infra/mediator/Mediator";
import { inject } from "../../infra/di/Registry";
 
export default class FinishRide {
    @inject("mediator")
    mediator!: Mediator;

    constructor(
        readonly rideRepository: RideRepository, 
        readonly positionRepository: PositionRepositoryDatabase
    ) {}

    async execute(input: Input) {
        const ride = await this.rideRepository.getRideById(input.rideId);
        const positions = await this.positionRepository.listByRideId(input.rideId);
        ride.finish(positions);
        await this.rideRepository.updateRide(ride);
        await this.mediator.notifyAll("rideCompleted", { rideId: ride.getRideId() })
    }
}

type Input = { rideId: string }