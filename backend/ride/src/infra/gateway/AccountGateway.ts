import axios from "axios";

export default interface AccountGateway {
    signup(input: SignupInput): Promise<any>;
    getAccountById(accountId: string): Promise<GetAccountByIdOutput>;
}

export class AccountGatewayHttp implements AccountGateway {

    async signup(input: SignupInput): Promise<any> {
        const response = await axios.post("http://localhost:3000/signup", input);
        return response.data;
    }

    async getAccountById(accountId: string): Promise<GetAccountByIdOutput> {
        const response = await axios.get(`http://localhost:3000/account/${accountId}`);
        return response.data;
    }
}

type SignupInput = {
    name: string,
    email: string,
    cpf: string,
    password: string,
    carPlate?: string,
    isPassenger?: boolean,
    isDriver?: boolean,
}

type GetAccountByIdOutput = {
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    password: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean,
}