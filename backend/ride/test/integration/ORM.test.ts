import { Transaction } from "../../src/domain/entity/Transaction";
import UUID from "../../src/domain/vo/UUID";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import ORM from "../../src/infra/orm/ORM";
import { TransactionModel } from "../../src/infra/orm/TransactionModel";

test("Deve inserir um registro no banco de dados", async function () {
    const connection = new PgPromiseAdapter();
    const orm = new ORM(connection);
    const transaction = Transaction.create(UUID.create().getValue(), 100);
    await orm.save(TransactionModel.FromAggregate(transaction));
    const savedTransaction = await orm.get(TransactionModel, "transaction_id", transaction.getTransactionId());
    console.log(savedTransaction.toAggregate());
    expect(savedTransaction.amount).toBe(100);
    await orm.connection.close();
});