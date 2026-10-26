import axios from "axios"
import { test, expect } from "@jest/globals"

axios.defaults.validateStatus = function() {
    return true;
}

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
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;
    const responseGetAccount = await axios.get(`http://localhost:3000/account/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;

    // Then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});

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

    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;
    const responseGetAccount = await axios.get(`http://localhost:3000/account/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;

    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
    expect(outputGetAccount.isDriver).toBe(input.isDriver);
    expect(outputGetAccount.carPlate).toBe(input.carPlate);
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

    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Invalid name");
});

test("Não deve criar uma conta de passageiro com o email inválido", async function() {
    // Given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true,
    }

    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Invalid email");
});

test("Não deve criar uma conta de passageiro com o cpf inválido", async function() {
    // Given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321",
        password: "123456",
        isPassenger: true,
    }

    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Invalid cpf");
});

test("Deve criar uma conta de motorista", async function() {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: false,
        isDriver: true,
        carPlate: "ABC12"
    }

    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Invalid car plate");
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

    await axios.post("http://localhost:3000/signup", input);
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Duplicated account");
});