import { Transaction } from "../../domain/entity/Transaction";
import { inject } from "../di/Registry";
import ORM, { TransactionModel } from "../orm/ORM";

export default interface TransactionRepository {
    saveTransaction(transaction: Transaction): Promise<void>;
    getTransactionById(transactionId: string): Promise<Transaction>;
    getTransactionByRideId(rideId: string): Promise<Transaction>;
}

export class TransactionRepositoryDatabase implements TransactionRepository {
    @inject("orm")
    orm!: ORM

    async saveTransaction(transaction: Transaction): Promise<void> {
        await this.orm.save(TransactionModel.FromAggregate(transaction));
    }

    async getTransactionById(transactionId: string): Promise<Transaction> {
        const transaction = await this.orm.get(TransactionModel, "transaction_id", transactionId);
        return transaction.toAggregate();
    }

    async getTransactionByRideId(rideId: string): Promise<Transaction> {
        const transaction = await this.orm.get(TransactionModel, "ride_id", rideId);
        return transaction.toAggregate();
    }
}