import { AccountRepository } from "../../infra/repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";
 
export default class AcceptRide {
    constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) {}

    async execute(input: Input) {
        const account = await this.accountRepository.getAccountById(input.driverId);
        if (!account?.isDriver) throw new Error("Account must be from a driver");
        const hasActiveRide = await this.rideRepository.hasActiveRideByDriverId(input.driverId);
        if (hasActiveRide) throw new Error("Driver already have an active ride");
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.accept(input.driverId);
        console.log("Ride accepted with ID:", ride.getRideId(), "by driver:", input.driverId);
        await this.rideRepository.updateRide(ride);
    }
}

type Input = { rideId: string, driverId: string };
