import { beforeEach, test, expect, afterEach } from "@jest/globals";
import { MailerGatewayMemory } from "../../src/infra/gateway/MailerGateway";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepository";
import RequestRide from "../../src/application/usecase/RequestRide";
import GetRide from "../../src/application/usecase/GetRide";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import AcceptRide from "../../src/application/usecase/AcceptRide";
import StartRide from "../../src/application/usecase/StartRide";
import UpdatePosition from "../../src/application/usecase/UpdatePosition";
import { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";
import AccountGateway, { AccountGatewayHttp } from "../../src/infra/gateway/AccountGateway";
import { AxiosAdapter } from "../../src/infra/http/HttpClient";
import FinishRide from "../../src/application/usecase/FinishRide";
import { TransactionRepositoryDatabase } from "../../src/infra/repository/TransactionRepository";

let connection: PgPromiseAdapter;
let accountGateway: AccountGateway;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let positionRepository: PositionRepositoryDatabase;
let finishRide: FinishRide;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const httpClient = new AxiosAdapter();
    const rideRepository = new RideRepositoryDatabase(connection);
    positionRepository = new PositionRepositoryDatabase(connection);
    const transactionRepository = new TransactionRepositoryDatabase(connection);
    const mailerGareway = new MailerGatewayMemory();
    accountGateway = new AccountGatewayHttp(httpClient);
    requestRide = new RequestRide(accountGateway, rideRepository);
    getRide = new GetRide(accountGateway, rideRepository, positionRepository, transactionRepository);
    acceptRide = new AcceptRide(accountGateway, rideRepository)
    startRide = new StartRide(rideRepository);
    updatePosition = new UpdatePosition(rideRepository, positionRepository);
    finishRide = new FinishRide(rideRepository, positionRepository);
})

test("Deve finalizar uma corrida em horário comercial", async function() {
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
    const inputStartRide = { rideId: outputRequestRide.rideId };
    await startRide.execute(inputStartRide);

    const inputUpdatePosition1 = {
        rideId: outputRequestRide.rideId,
        lat: -27.584905257808835,
		long: -48.545022195325124,
        date: new Date("2023-03-01T10:00:00"),
    };
    await updatePosition.execute(inputUpdatePosition1);

    const inputUpdatePosition2 = {
        rideId: outputRequestRide.rideId,
        lat: -27.496887588317275,
		long: -48.522234807851476,
        date: new Date("2023-03-01T10:30:00"),
    };
    await updatePosition.execute(inputUpdatePosition2);

    const inputFinishRide = {
        rideId: outputRequestRide.rideId
    };

    await finishRide.execute(inputFinishRide);

    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe('completed');
    expect(outputGetRide.distance).toBe(10);
    expect(outputGetRide.fare).toBe(21);

    expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

test("Deve finalizar uma corrida no domingo", async function() {
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
    const inputStartRide = { rideId: outputRequestRide.rideId };
    await startRide.execute(inputStartRide);

    const inputUpdatePosition1 = {
        rideId: outputRequestRide.rideId,
        lat: -27.584905257808835,
		long: -48.545022195325124,
        date: new Date("2023-03-05T10:00:00"),
    };
    await updatePosition.execute(inputUpdatePosition1);

    const inputUpdatePosition2 = {
        rideId: outputRequestRide.rideId,
        lat: -27.496887588317275,
		long: -48.522234807851476,
        date: new Date("2023-03-05T10:30:00"),
    };
    await updatePosition.execute(inputUpdatePosition2);

    const inputFinishRide = {
        rideId: outputRequestRide.rideId
    };

    await finishRide.execute(inputFinishRide);

    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe('completed');
    expect(outputGetRide.distance).toBe(10);
    expect(outputGetRide.fare).toBe(50);

    expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

test("Deve finalizar uma corrida deve custar um real", async function() {
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
    const inputStartRide = { rideId: outputRequestRide.rideId };
    await startRide.execute(inputStartRide);

    const inputUpdatePosition1 = {
        rideId: outputRequestRide.rideId,
        lat: -27.584905257808835,
		long: -48.545022195325124,
        date: new Date("2026-10-30T10:00:00"),
    };
    await updatePosition.execute(inputUpdatePosition1);

    const inputUpdatePosition2 = {
        rideId: outputRequestRide.rideId,
        lat: -27.496887588317275,
		long: -48.522234807851476,
        date: new Date("2026-10-30T10:30:00"),
    };
    await updatePosition.execute(inputUpdatePosition2);

    const inputFinishRide = {
        rideId: outputRequestRide.rideId
    };

    await finishRide.execute(inputFinishRide);

    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe('completed');
    expect(outputGetRide.distance).toBe(10);
    expect(outputGetRide.fare).toBe(1);

    expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

test("Deve finalizar uma corrida em horário noturno", async function() {
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
    const inputStartRide = { rideId: outputRequestRide.rideId };
    await startRide.execute(inputStartRide);

    const inputUpdatePosition1 = {
        rideId: outputRequestRide.rideId,
        lat: -27.584905257808835,
		long: -48.545022195325124,
        date: new Date("2023-03-01T23:00:00"),
    };
    await updatePosition.execute(inputUpdatePosition1);

    const inputUpdatePosition2 = {
        rideId: outputRequestRide.rideId,
        lat: -27.496887588317275,
		long: -48.522234807851476,
        date: new Date("2023-03-01T23:30:00"),
    };
    await updatePosition.execute(inputUpdatePosition2);

    const inputFinishRide = {
        rideId: outputRequestRide.rideId
    };

    await finishRide.execute(inputFinishRide);

    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe('completed');
    expect(outputGetRide.distance).toBe(10);
    expect(outputGetRide.fare).toBe(39);

    expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);

    console.log(outputGetRide);
});

afterEach(async () => {
    await connection.close();
});
