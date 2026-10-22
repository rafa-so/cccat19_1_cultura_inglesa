import HttpClient from "../http/HttpClient";

export default interface AccountGateway {
    signup(input: SignupInput): Promise<any>;
    getAccountById(accountId: string): Promise<GetAccountByIdOutput>;
}

export class AccountGatewayHttp implements AccountGateway {

    constructor(readonly httpClient: HttpClient) {}

    async signup(input: SignupInput): Promise<any> {
        return await this.httpClient.post("http://localhost:3000/signup", input);
    }

    async getAccountById(accountId: string): Promise<GetAccountByIdOutput> {
        return await this.httpClient.get(`http://localhost:3000/account/${accountId}`);
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