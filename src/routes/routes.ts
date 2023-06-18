import { Router } from "express";
import { connections } from "./connections.js";

export const routes = Router();

routes.use(connections)