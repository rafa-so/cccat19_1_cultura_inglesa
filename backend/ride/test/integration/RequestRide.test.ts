import { beforeEach, test, expect, afterEach } from "@jest/globals";
import { MailerGatewayMemory } from "../../src/infra/gateway/MailerGateway";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepository";
import RequestRide from "../../src/application/usecase/RequestRide";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";
import AccountGateway, { AccountGatewayHttp } from "../../src/infra/gateway/AccountGateway";
import GetRide from "../../src/application/usecase/GetRide";

let connection: PgPromiseAdapter;
let requestRide: RequestRide;
let getRide: GetRide;
let accountGateway: AccountGateway;

beforeEach(() => {
    accountGateway = new AccountGatewayHttp();
    connection = new PgPromiseAdapter();
    const rideRepository = new RideRepositoryDatabase(connection);
    const positionRepository = new PositionRepositoryDatabase(connection);
    requestRide = new RequestRide(accountGateway, rideRepository);
    getRide = new GetRide(accountGateway, rideRepository, positionRepository);
})

test("Deve solicitar uma corrida", async function() {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true,
    }

    const outputSignup = await accountGateway.signup(input);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide).toBeDefined();
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
    expect(outputGetRide.passengerId).toBe(outputSignup.accountId);
    expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
    expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
    expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
    expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
    expect(outputGetRide.status).toBe("requested");
    expect(outputGetRide.fare).toBe(0);
    expect(outputGetRide.distance).toBe(0);
});

test("Deve solicitar uma corrida se a conta não for de um passageiro", async function() {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        carPlate: "AAA9999",
        isDriver: true,
    }

    const outputSignup = await accountGateway.signup(input);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }
    
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Account must be from a passenger"));
});

test("Não pode solicitar uma corrida se já tiver outra ativa", async function() {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true,
    }

    const outputSignup = await accountGateway.signup(input);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }

    await requestRide.execute(inputRequestRide)
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Passenger already have an active ride"));
});

afterEach(async () => {
    await connection.close();
});
