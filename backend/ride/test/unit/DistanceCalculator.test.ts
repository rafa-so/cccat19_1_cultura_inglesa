import Position from "../../src/domain/entity/Position";
import DistanceCalculator from "../../src/domain/service/DistanceCalculator";
import Coord from "../../src/domain/vo/Coord";
import UUID from "../../src/domain/vo/UUID";

test("Deve calcular a distância entre dois pontos", () => {
    const positions = [];
    const rideId = UUID.create().getValue();
    positions.push(Position.create(rideId, -27.58490525780883, -48.545022195325124));
    positions.push(Position.create(rideId, -27.496887588317275, -48.522234807851476));
    expect(DistanceCalculator.calculateDistanceBetweenPositions(positions)).toBe(10);
});