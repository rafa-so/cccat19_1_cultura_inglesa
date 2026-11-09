import { Transaction } from "../../src/domain/entity/Transaction";
import UUID from "../../src/domain/vo/UUID";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import ORM, { TransactionModel } from "../../src/infra/orm/ORM";

test("Deve inserir um registro no banco de dados", async function () {
    const connection = new PgPromiseAdapter();
    const orm = new ORM(connection);
    const transaction = Transaction.create(UUID.create().getValue(), 100);
    await orm.save(TransactionModel.FromAggregate(transaction));
    // const savedTransaction = await orm.get(Transaction, "transaction_id", transaction.getTransactionId());
    // expect(savedTransaction.amount).toBe(100);
});