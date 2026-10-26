import Coord from "../../domain/vo/Coord";
import { RideRepository } from "../../infra/repository/RideRepository";
import { PositionRepositoryDatabase } from "../../infra/repository/PositionRepository";
import DistanceCalculator from "../../domain/service/DistanceCalculator";
import AccountGateway from "../../infra/gateway/AccountGateway";
import TransactionRepository from "../../infra/repository/TransactionRepository";
 
export default class GetRide {
    constructor(
        readonly accountGateway: AccountGateway, 
        readonly rideRepository: RideRepository,
        readonly positionRepository: PositionRepositoryDatabase,
        readonly transactionRepository: TransactionRepository
    ) {}

    async execute(rideId: any): Promise<Output> {
        const ride = await this.rideRepository.getRideById(rideId);
        const passengerAccount = await this.accountGateway.getAccountById(ride.getPassengerId());

        let transaction;
        let distance;
        if (ride.getStatus() === 'completed') {
            distance = ride.getDistance();
            transaction = await this.transactionRepository.getTransactionByRideId(ride.getRideId());
        } else {
            const positions = await this.positionRepository.listByRideId(rideId);
            distance = DistanceCalculator.calculateDistanceBetweenPositions(positions);
        }

        return {
            rideId: ride.getRideId(),
            passengerId: ride.getPassengerId(),
            driverId: ride.getDriverId(),
            fromLat: ride.getFrom().getLat(),
            fromLong: ride.getFrom().getLong(),
            toLat: ride.getTo().getLat(),
            toLong: ride.getTo().getLong(),
            fare: ride.getFare(),
            distance,
            status: ride.getStatus(),
            date: ride.date,
            passengerName: passengerAccount?.name ?? '',
            transactionId: transaction?.getTransactionId(),
            transactionAmount: transaction?.amount,
            transactionStatus: transaction?.status
        };
    }
}

type Output = {
    rideId: string,
    passengerId: string,
    passengerName: string;
    driverId?: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    fare: number,
    distance: number,
    status: string,
    date: Date,
    transactionId?: string,
    transactionAmount?: number,
    transactionStatus?: string
}
