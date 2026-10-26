import { Transaction } from "../../domain/entity/Transaction";
import TransactionRepository from "../../infra/repository/TransactionRepository";

export default class GetTransaction {
    constructor(readonly transactionRepository: TransactionRepository) {}

    async execute (transactionId: string): Promise<Output> {
        const transaction = await this.transactionRepository.getTransactionById(transactionId);
        return { 
            transactionId: transaction.getTransactionId(),
            rideId: transaction.getRideId(),
            amount: transaction.amount,
            status: transaction.status,
            date: transaction.date
        };
    }
}

type Input = {
    rideId: string,
    amount: number
}

type Output = {
    transactionId: string,
    rideId: string,
    amount: number,
    status: string,
    date: Date
}