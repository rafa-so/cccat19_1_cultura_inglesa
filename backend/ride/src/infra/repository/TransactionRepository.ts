import { Transaction } from "../../domain/entity/Transaction";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface TransactionRepository {
    saveTransaction(transaction: Transaction): Promise<void>;
    getTransactionById(transactionId: string): Promise<Transaction>;
}

export class TransactionRepositoryDatabase implements TransactionRepository {

    constructor(readonly connection: DatabaseConnection){}

    async saveTransaction(transaction: Transaction): Promise<void> {
        await this.connection.query("INSERT INTO ccca.transaction (transaction_id, ride_id, amount, status, date) values ($1, $2, $3, $4, $5)", 
            [transaction.getTransactionId(), transaction.getRideId(), transaction.amount, transaction.status, transaction.date]);
    }

    async getTransactionById(transactionId: string): Promise<Transaction> {
        const [transactionData] = await this.connection.query("SELECT * FROM ccca.transaction where transaction_id = $1", [transactionId]);
        return new Transaction(transactionData.transaction_id, transactionData.ride_id, parseFloat(transactionData.amount), transactionData.status, transactionData.date);
    }
}