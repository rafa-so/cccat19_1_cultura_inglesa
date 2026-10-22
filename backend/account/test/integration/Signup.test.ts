import { beforeEach, test, expect, afterEach } from "@jest/globals";
import AccountDAODatabase from "../../src/infra/repository/AccountRepository";
import GetAccount from "../../src/application/usecase/GetAccount";
import Signup from "../../src/application/usecase/Signup";
import { MailerGatewayMemory } from "../../src/infra/gateway/MailerGateway";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";

let connection: PgPromiseAdapter;
let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const accountDAO = new AccountDAODatabase(connection);
    const mailerGareway = new MailerGatewayMemory();
    signup = new Signup(accountDAO, mailerGareway);
    getAccount = new GetAccount(accountDAO);
});

afterEach(async () => {
    await connection.close();
});

test("Deve criar uma conta de passageiro", async function() {
    // Given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true,
    }

    // When
    const responseSignup = await signup.execute(input);
    const responseGetAccount = await getAccount.execute(responseSignup.accountId);

    // Then
    expect(responseSignup.accountId).toBeDefined();
    expect(responseGetAccount?.name).toBe(input.name);
    expect(responseGetAccount?.email).toBe(input.email);
    expect(responseGetAccount?.cpf).toBe(input.cpf);
    expect(responseGetAccount?.isPassenger).toBe(input.isPassenger);
});

// test("Deve criar uma conta de passageiro com stub", async function() {
//     /**
//      * Com stub eu já configuro o comportamento pré definido para determinados métodos, mesmo que eles não retornem nada. 
//      * O stub é mais utilizado para isolar o teste, ou seja, para não depender de outros componentes, como o banco de dados 
//      * ou um serviço externo. Ele é útil para testar apenas a lógica do serviço, sem se preocupar com as dependências externas.
//      */
//     const mailerStub = sinon.stub(MailerGatewayMemory.prototype, "send").resolves();
//     const accountDAOStub1 = sinon.stub(AccountDAODatabase.prototype, "getAccountByEmail").resolves();
//     const accountDAOStub2 = sinon.stub(AccountDAODatabase.prototype, "saveAccount").resolves();

//     // Given
//     const input = {
//         accountId: '',
//         name: "John Doe",
//         email: `john.doe${Math.random()}@gmail.com`,
//         cpf: "97456321558",
//         password: "123456",
//         isPassenger: true,
//         carPlate: '',
//         isDriver: false
//     }

//     const accountDAOStub3 = sinon.stub(AccountDAODatabase.prototype, "getAccountById").resolves(input);

//     // When
//     const responseSignup = await signup.execute(input);
//     const responseGetAccount = await getAccount.execute(responseSignup.accountId);

//     // Then
//     expect(responseSignup.accountId).toBeDefined();
//     expect(responseGetAccount.name).toBe(input.name);
//     expect(responseGetAccount.email).toBe(input.email);
//     expect(responseGetAccount.cpf).toBe(input.cpf);
//     expect(responseGetAccount.isPassenger).toBe(input.isPassenger);

//     mailerStub.restore();
//     accountDAOStub1.restore();
//     accountDAOStub2.restore();
//     accountDAOStub3.restore();
// });

// test("Deve criar uma conta de passageiro com spy", async function() {
//     /**
//      * A lógica do spy é diferenente do stub. Ele fica espionando o método definido,
//      * e depois da execução podemos executar uma série de testes em cima da observação
//      * do spy. Ele é mais utilizado para verificar se um método foi chamado, quantas vezes ele foi chamado,
//      * e quais foram os parâmetros passados para ele. Ele é útil para verificar se o serviço está chamando as dependências externas corretamente.
//      */
//     const mailerSpy = sinon.spy(MailerGatewayMemory.prototype, "send");

//     // Given
//     const input = {
//         accountId: '',
//         name: "John Doe",
//         email: `john.doe${Math.random()}@gmail.com`,
//         cpf: "97456321558",
//         password: "123456",
//         isPassenger: true,
//         carPlate: '',
//         isDriver: false
//     }

//     // When
//     const responseSignup = await signup.execute(input);
//     const responseGetAccount = await getAccount.execute(responseSignup.accountId);

//     // Then
//     expect(responseSignup.accountId).toBeDefined();
//     expect(responseGetAccount.name).toBe(input.name);
//     expect(responseGetAccount.email).toBe(input.email);
//     expect(responseGetAccount.cpf).toBe(input.cpf);
//     expect(responseGetAccount.isPassenger).toBe(input.isPassenger);

//     expect(mailerSpy.calledOnce).toBe(true);
//     expect(mailerSpy.calledWith(input.email, "Welcome!", "...")).toBe(true);
//     mailerSpy.restore();
// });

// test("Deve criar uma conta de passageiro com mock", async function() {
//     /**
//      * O mock é uma combinação de stub e spy. Ele permite definir o comportamento de um método,
//      * assim como verificar se ele foi chamado, quantas vezes foi chamado e com quais parâmetros.
//      * Ele é útil para testar a interação entre o serviço e suas dependências externas.
//      * Ele verifica a si próprio, o spy temos que sempre verificar se o método foi chamado, 
//      * e o stub não tem essa preocupação, ele apenas define o comportamento do método.
//      */
//     const mailerGatewayMock = sinon.mock(MailerGatewayMemory.prototype);

//     // Given
//     const input = {
//         name: "John Doe",
//         email: `john.doe${Math.random()}@gmail.com`,
//         cpf: "97456321558",
//         password: "123456",
//         isPassenger: true,
//     }

//     mailerGatewayMock.expects("send").withArgs(input.email, "Welcome!", "...").once().callsFake(() => {
//         console.log("abc");
//     });

//     // When
//     const responseSignup = await signup.execute(input);
//     const responseGetAccount = await getAccount.execute(responseSignup.accountId);

//     // Then
//     expect(responseSignup.accountId).toBeDefined();
//     expect(responseGetAccount.name).toBe(input.name);
//     expect(responseGetAccount.email).toBe(input.email);
//     expect(responseGetAccount.cpf).toBe(input.cpf);
//     expect(responseGetAccount.isPassenger).toBe(input.isPassenger);

//     mailerGatewayMock.verify();
//     mailerGatewayMock.restore();
// });

test("Deve criar uma conta de motorista", async function() {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: false,
        isDriver: true,
        carPlate: "ABC1234"
    }

    const responseSignup = await signup.execute(input);
    const responseGetAccount = await getAccount.execute(responseSignup.accountId);

    expect(responseSignup.accountId).toBeDefined();
    expect(responseGetAccount?.name).toBe(input.name);
    expect(responseGetAccount?.email).toBe(input.email);
    expect(responseGetAccount?.cpf).toBe(input.cpf);
    expect(responseGetAccount?.isPassenger).toBe(input.isPassenger);
    expect(responseGetAccount?.isDriver).toBe(input.isDriver);
    expect(responseGetAccount?.carPlate).toBe(input.carPlate);
});

test("Não deve criar uma conta de passageiro com o nome inválido", async function() {
    // Given
    const input = {
        name: "John",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true,
    }

    await expect(signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar uma conta de passageiro com conta duplicada", async function() {
    // Given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true,
    }

    await signup.execute(input);
    await expect(signup.execute(input)).rejects.toThrow(new Error("Duplicated account"));
});