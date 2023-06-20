import { Router } from "express";
import { connections } from "./connections.js";
import { notify } from "./notify.js";
import { connection } from "./connection.js";

export const routes = Router();

routes.use(connections);
routes.use(connection);
routes.use(notify);
