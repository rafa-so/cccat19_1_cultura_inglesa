import { Transaction } from "../../domain/entity/Transaction";
import DatabaseConnection from "../database/DatabaseConnection";

export default class ORM {
    constructor(
        readonly connection: DatabaseConnection
    ) {}

    async save(model: Model) {
        const columns = model.columns.map((colmun: any) => colmun.column).join(', ');
        const params = model.columns.map((column: any, index) => `$${index + 1}`).join(", ");
        const values = model.columns.map((column) => model[column.property]);
        const query = `INSERT INTO ${model.schema}.${model.table} (${columns}) VALUES (${params})`;
        await this.connection.query(query, values);
    }

    async get(model: any, field: string, value: any) {
        const query = `select * from ${model.prototype.schema}.${model.prototype.table} where ${field} = $1`;
        const [data] = await this.connection.query(query, [value]);
        const obj = new model();
        for(const column of model.prototype.columns) {
            if (column.type === "number") {
                obj[column.property] = parseFloat(data[column.column]);
            } else {
                obj[column.property] = data[column.column];
            }
        }
        return obj;

    }
}

export class Model {
    schema!: string;
    table!: string;
    columns!: [{ column: string, property: string, type: string, pk: boolean }];
    [property: string]: any;
}

@model("ccca", "transaction")
export class TransactionModel extends Model{
    @column("transaction_id")
    transactionId: string;
    @column("ride_id")
    rideId: string;
    @column("amount", "number")
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

    toAggregate() {
        return new Transaction(this.transactionId, this.rideId, this.amount, this.status, this.date);
    }
}

function model (schema: string, table: string) {
    return function (target: any) {
        target.prototype.schema = schema;
        target.prototype.table = table;
    }
}

function column(column: string, type: string = "string") {
    return function (target: any, propertyKey: string) {
        target.columns = target.columns || [];
        target.columns.push({ column, property: propertyKey, type })
    }
}