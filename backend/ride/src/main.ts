import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer"

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();

httpServer.listen(3000);
