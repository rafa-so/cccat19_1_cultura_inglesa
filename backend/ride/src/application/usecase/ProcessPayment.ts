import { Transaction } from "../../domain/entity/Transaction";
import TransactionRepository from "../../infra/repository/TransactionRepository";

export default class ProcessPayment {
    constructor(readonly transactionRepository: TransactionRepository) {}

    async execute (input: Input): Promise<Output> {
        console.log("process payment")
        const transaction = Transaction.create(input.rideId, input.amount);
        await this.transactionRepository.saveTransaction(transaction);
        return { transactionId: transaction.getTransactionId() };
    }
}

type Input = {
    rideId: string,
    amount: number
}

type Output = {
    transactionId: string
}