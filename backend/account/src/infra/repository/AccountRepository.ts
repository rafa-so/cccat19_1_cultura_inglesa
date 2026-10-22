import Account from "../../domain/entity/Account";
import DatabaseConnection from "../database/DatabaseConnection";

export interface AccountRepository {
    getAccountById(accountId: string): Promise<Account | undefined>;
    saveAccount(account: Account): Promise<void>;
    getAccountByEmail(email: string): Promise<Account | undefined>;
}

export default class AccountRepositoryDatabase implements AccountRepository {

    constructor(readonly connection: DatabaseConnection){}

    async getAccountByEmail(email: string) {
        const [accountData] = await this.connection.query("select * from ccca.account where email = $1", [email]);
        if (!accountData) return;
        return new Account(
            accountData.account_id,
            accountData.name,
            accountData.email,
            accountData.cpf,
            accountData.car_plate,
            accountData.password,
            accountData.is_passenger,
            accountData.is_driver
        );
    }

    async getAccountById(accountId: string) {
        const [accountData] = await this.connection.query("SELECT * FROM ccca.account WHERE account_id = $1", [ accountId ]);
        if (!accountData) return;
        return new Account(
            accountData.account_id,
            accountData.name,
            accountData.email,
            accountData.cpf,
            accountData.car_plate,
            accountData.password,
            accountData.is_passenger,
            accountData.is_driver
        );
    }

    async saveAccount(account: Account) {
        await this.connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", 
            [account.getAccountId(), account.getName(), account.getEmail(), account.getCpf(), account.getCarPlate(), !!account.isPassenger, !!account.isDriver, account.getPassword()]
        );
    }
}

export class AccountRepositoryMemory implements AccountRepository {
    accounts: Account[];

    constructor() {
        this.accounts = [];
    }

    async getAccountByEmail(email: string) {
        return this.accounts.find((account: Account) => account.getEmail() === email);
    }

    async getAccountById(accountId: string) {
        return this.accounts.find((account: Account) => account.getAccountId() === accountId);
    }

    async saveAccount(account: Account) {
        this.accounts.push(account);
    }
}