import HttpServer from "../http/HttpServer";
import Signup from "../../application/usecase/Signup";
import GetAccount from "../../application/usecase/GetAccount";

export default class AccountController {
    constructor(
        readonly httpServer: HttpServer, 
        readonly signup: Signup, 
        readonly getAccount: GetAccount
    ){
        httpServer.register('post', '/signup', async (params: any, body: any) => {
            const output = await this.signup.execute(body);
            return output;
        });

        httpServer.register('get', '/account/:{accountId}', async (params: any, body: any) => {
            const output = await this.getAccount.execute(params.accountId);
            return output;
        });
    }
}
