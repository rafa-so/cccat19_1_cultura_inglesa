import Position from "../../domain/entity/Position";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface PositionRepository {
    savePosition(position: Position): Promise<void>;
    listByRideId(rideId: string): Promise<Position[]>;
}

export class PositionRepositoryDatabase implements PositionRepository {

    constructor(readonly connection: DatabaseConnection) {}

    async savePosition(position: Position): Promise<void> {
        await this.connection.query("INSERT INTO ccca.position (position_id, ride_id, lat, long, date) VALUES ($1, $2, $3, $4, $5)", 
            [position.getPositionId(), position.getRideId(), position.getCoord().getLat(), position.getCoord().getLong(), position.date]);
    }

    async listByRideId(rideId: string): Promise<Position[]> {
        const positions = [];
        const positionsData = await this.connection.query("SELECT * FROM ccca.position WHERE ride_id = $1", [rideId]);
        for (const position of positionsData) {
            positions.push(new Position(position.position_id, position.ride_id, position.lat, position.long, position.date));
        }
        return positions;
    }
}
