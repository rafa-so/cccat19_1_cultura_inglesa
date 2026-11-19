import { Transaction } from "../../domain/entity/Transaction";
import Registry, { inject } from "../../infra/di/Registry";
import { RideRepository } from "../../infra/repository/RideRepository";
import TransactionRepository from "../../infra/repository/TransactionRepository";

export default class ProcessPayment {
    @inject("rideRepository")
    rideRepository!: RideRepository

    @inject("transactionRepository")
    transactionRepository!: TransactionRepository;
    
    constructor() {}

    async execute (input: Input): Promise<Output> {
        console.log("process payment")
        const ride = await this.rideRepository.getRideById(input.rideId);
        const amount = ride.getFare();
        const transaction = Transaction.create(input.rideId, amount);
        await this.transactionRepository.saveTransaction(transaction);
        return { transactionId: transaction.getTransactionId() };
    }
}

type Input = { rideId: string }

type Output = { transactionId: string }