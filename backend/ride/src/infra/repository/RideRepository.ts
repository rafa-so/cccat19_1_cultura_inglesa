import Ride from "../../domain/entity/Ride";
import DatabaseConnection from "../database/DatabaseConnection";
import Position from "../../domain/entity/Position";

export interface RideRepository {
    saveRide(ride: Ride): Promise<void>;
    updateRide(ride: Ride): Promise<void>;
    getRideById(rideId: string): Promise<Ride>;
    hasActiveRideByPassengerId(passengerId: string): Promise<boolean>;
    hasActiveRideByDriverId(driverId: string): Promise<boolean>;
}

export default class RideRepositoryDatabase implements RideRepository {

    constructor(readonly connection: DatabaseConnection) {}

    async getRideById(rideId: string): Promise<Ride> {
        const [rideData] = await this.connection.query("SELECT * FROM ccca.ride WHERE ride_id = $1", [ rideId ]);
        return new Ride(
            rideData.ride_id,
            rideData.passenger_id,
            rideData.driver_id,
            parseFloat(rideData.from_lat),
            parseFloat(rideData.from_long),
            parseFloat(rideData.to_lat),
            parseFloat(rideData.to_long),
            parseFloat(rideData.fare),
            parseFloat(rideData.distance),
            rideData.status,
            rideData.date
        );
    }

    async saveRide(ride: Ride) {
        await this.connection.query("insert into ccca.ride (ride_id, passenger_id, driver_id, from_lat, from_long, to_lat, to_long, fare, distance, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", 
            [ride.getRideId(), ride.getPassengerId(), ride.getDriverId(), ride.getFrom().getLat(), ride.getFrom().getLong(), ride.getTo().getLat(), ride.getTo().getLong(), ride.getFare(), ride.getDistance(), ride.getStatus(), ride.date]
        );
    }

    async updateRide(ride: Ride) {
        await this.connection.query("UPDATE ccca.ride SET status = $1, driver_id = $2, distance= $3, fare = $4 WHERE ride_id = $5", [ride.getStatus(), ride.getDriverId(), ride.getDistance(), ride.getFare(), ride.getRideId()]);
        await this.connection.query("DELETE FROM ccca.position where ride_id = $1", [ride.getRideId()])
    }

    async hasActiveRideByPassengerId(passengerId: string) {
        const [rideData] = await this.connection.query("SELECT 1 FROM ccca.ride WHERE passenger_id = $1 AND status NOT IN ('completed', 'cancelled') LIMIT 1", [ passengerId ]);
        return !!rideData;
    }

    async hasActiveRideByDriverId(driverId: string) {
        const [rideData] = await this.connection.query("SELECT 1 FROM ccca.ride WHERE driver_id = $1 AND status NOT IN ('completed', 'cancelled') LIMIT 1", [ driverId ]);
        return !!rideData;
    }
}
