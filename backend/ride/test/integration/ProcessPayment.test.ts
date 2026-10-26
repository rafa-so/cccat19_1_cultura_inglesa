import GetTransaction from "../../src/application/usecase/GetTransaction";
import ProcessPayment from "../../src/application/usecase/ProcessPayment";
import UUID from "../../src/domain/vo/UUID";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import { TransactionRepositoryDatabase } from "../../src/infra/repository/TransactionRepository";

test("Deve processar o pagamento", async function (){
    const connection = new PgPromiseAdapter();
    const transactionRepository = new TransactionRepositoryDatabase(connection);
    const processPayment = new ProcessPayment(transactionRepository);
    const getTransaction = new GetTransaction(transactionRepository);
    const inputProcessPayment = {
        rideId: UUID.create().getValue(),
        amount: 100
    };

    const outputProcessPayment = await processPayment.execute(inputProcessPayment);
    const outputGetTransaction = await getTransaction.execute(outputProcessPayment.transactionId);

    expect(outputGetTransaction.rideId).toBe(inputProcessPayment.rideId);
    expect(outputGetTransaction.amount).toBe(inputProcessPayment.amount);
});
