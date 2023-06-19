import { Router } from "express";
import { connections } from "./connections.js";
import { notify } from "./notify.js";

export const routes = Router();

routes.use(connections)
routes.use(notify)