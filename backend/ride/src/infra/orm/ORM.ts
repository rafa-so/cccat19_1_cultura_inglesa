import { Transaction } from "../../domain/entity/Transaction";
import DatabaseConnection from "../database/DatabaseConnection";

export default class ORM {
    constructor(
        readonly connection: DatabaseConnection
    ) {}

    async save(model: Model) {
        const columns = model.columns.map((colmun: any) => colmun.column).join(', ');
        const params = model.columns.map((column: any, index) => `$${index + 1}`).join(", ");
        const query = `INSERT INTO ${model.schema}.${model.table} (${columns}) VALUES (${params})`;
        console.log(query);

    }
}

export class Model {
    schema!: string;
    table!: string;
    columns!: [{ column: string, property: string, pk: boolean }];
}

@model("ccca", "transaction")
export class TransactionModel extends Model{
    @column("transaction_id")
    transactionId: string;
    @column("ride_id")
    rideId: string;
    @column("amount")
    amount: number;
    @column("status")
    status: string;
    @column("date")
    date: Date;

    constructor(transactionId: string, rideId: string, amount: number, status: string, date: Date) {
        super();
        this.transactionId = transactionId;
        this.rideId = rideId;
        this.amount = amount;
        this.status = status;
        this.date = date;
    }

    static FromAggregate(transaction: Transaction) {
        return new TransactionModel(transaction.getTransactionId(), transaction.getRideId(), transaction.amount, transaction.status, transaction.date);
    }
}

function model (schema: string, table: string) {
    return function (target: any) {
        target.prototype.schema = schema;
        target.prototype.table = table;
    }
}

function column(column: string) {
    return function (target: any, propertyKey: string) {
        target.columns = target.columns || [];
        target.columns.push({ column, property: propertyKey })
    }
}