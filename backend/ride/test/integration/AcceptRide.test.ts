import { beforeEach, test, expect, afterEach } from "@jest/globals";
import AccountGateway, { AccountGatewayHttp } from "../../src/infra/gateway/AccountGateway";
import { MailerGatewayMemory } from "../../src/infra/gateway/MailerGateway";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepository";
import RequestRide from "../../src/application/usecase/RequestRide";
import GetRide from "../../src/application/usecase/GetRide";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import AcceptRide from "../../src/application/usecase/AcceptRide";
import { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";
import { AxiosAdapter } from "../../src/infra/http/HttpClient";

let connection: PgPromiseAdapter;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let accountGateway: AccountGateway;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const httpClient = new AxiosAdapter();
    const rideRepository = new RideRepositoryDatabase(connection);
    const positionRepository = new PositionRepositoryDatabase(connection);
    const mailerGareway = new MailerGatewayMemory();
    accountGateway = new AccountGatewayHttp(httpClient);
    requestRide = new RequestRide(accountGateway, rideRepository);
    getRide = new GetRide(accountGateway, rideRepository, positionRepository);
    acceptRide = new AcceptRide(accountGateway, rideRepository)
})

test("Deve aceitar uma corrida", async function() {
    const inputSignupPassenger = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true,
    }

    const outputSignupPassenger = await accountGateway.signup(inputSignupPassenger);

    const inputSignupDriver = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: false,
        carPlate: "AAA9999",
        isDriver: true,
    }

    const outputSignupDriver = await accountGateway.signup(inputSignupDriver);

    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    const inputAcceptRide = { rideId: outputRequestRide.rideId, driverId: outputSignupDriver.accountId }
    await acceptRide.execute(inputAcceptRide)
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe("accepted");
    expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

afterEach(async () => {
    await connection.close();
});
