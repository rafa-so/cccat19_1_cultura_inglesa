import { beforeEach, test, expect, afterEach } from "@jest/globals";
import AccountRepositoryDatabase from "../../src/infra/repository/AccountRepository";
import Signup from "../../src/application/usecase/Signup";
import { MailerGatewayMemory } from "../../src/infra/gateway/MailerGateway";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepository";
import RequestRide from "../../src/application/usecase/RequestRide";
import GetRide from "../../src/application/usecase/GetRide";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import AcceptRide from "../../src/application/usecase/AcceptRide";
import StartRide from "../../src/application/usecase/StartRide";
import { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";

let connection: PgPromiseAdapter;
let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(connection);
    const rideRepository = new RideRepositoryDatabase(connection);
    const positionRepository = new PositionRepositoryDatabase(connection);
    // const accountDAO = new AccountDAOMemory();
    const mailerGareway = new MailerGatewayMemory();
    signup = new Signup(accountRepository, mailerGareway);
    requestRide = new RequestRide(accountRepository, rideRepository);
    getRide = new GetRide(accountRepository, rideRepository, positionRepository);
    acceptRide = new AcceptRide(accountRepository, rideRepository)
    startRide = new StartRide(rideRepository);
})

test("Deve iniciar uma corrida", async function() {
    const inputSignupPassenger = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true,
    }

    const outputSignupPassenger = await signup.execute(inputSignupPassenger);

    const inputSignupDriver = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: false,
        carPlate: "AAA9999",
        isDriver: true,
    }

    const outputSignupDriver = await signup.execute(inputSignupDriver);

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
    const inputStartRide = { rideId: outputRequestRide.rideId };
    await startRide.execute(inputStartRide);
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe("in_progress");
    expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

afterEach(async () => {
    await connection.close();
});
