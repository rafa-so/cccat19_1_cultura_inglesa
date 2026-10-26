import crypto from "crypto";
import pgp from "pg-promise";
import express from "express";
import { validateCpf } from "./domain/validateCpf";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

function isValidName(name: string) {
	return name.match(/[a-zA-Z] [a-zA-Z]+/);
}
 
function isValidEmail(email: string){
	return email.match(/^(.+)@(.+)$/)
}

function isValidCarPlate(carPlate: string) {
	return carPlate.match(/[A-Z]{3}[0-9]{4}/);
}

app.post("/signup", async function (req, res) {
	const input = req.body;
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
		const id = crypto.randomUUID();
		const [existingAccount] = await connection.query("select * from ccca.account where email = $1", [input.email]);
		if (existingAccount) throw new Error("Duplicated account");
		if (!isValidName(input.name)) throw new Error("Invalid name");
		if (!isValidEmail(input.email)) throw new Error("Invalid email");
		if (!validateCpf(input.cpf)) throw new Error("Invalid cpf");
		if (input.isDriver && !isValidCarPlate(input.carPlate)) throw new Error("Invalid car plate");
		await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
		res.json({ accountId: id });
	} catch (e: any) {
		res.status(422).json({ message: e.message });
	} finally {
		await connection.$pool.end();
	}
});

app.get("/account/:accountId", async function (req, res) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [accountData] = await connection.query("SELECT * FROM ccca.account WHERE account_id = $1", [ req.params.accountId ]);
	await connection.$pool.end();
	res.json(accountData);
});

app.listen(3000);
