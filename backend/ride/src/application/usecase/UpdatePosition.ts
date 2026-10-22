import { RideRepository } from "../../infra/repository/RideRepository";
import Position from "../../domain/entity/Position";
import { PositionRepositoryDatabase } from "../../infra/repository/PositionRepository";
 
export default class UpdatePosition {
    constructor(readonly rideRepository: RideRepository, readonly positionRepository: PositionRepositoryDatabase) {}

    async execute(input: Input) {
        const ride = await this.rideRepository.getRideById(input.rideId);
        if (ride.getStatus() !== "in_progress") throw new Error("Invalid status");
        const position = Position.create(input.rideId, input.lat, input.long)
        await this.positionRepository.savePosition(position);
    }
}

type Input = { rideId: string, lat: number, long: number }