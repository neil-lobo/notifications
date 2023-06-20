import config from "./config.js"
import { MongoClient, ServerApiVersion } from 'mongodb';

const mongo = new MongoClient(config.db?.connectionURI ?? "mongodb://localhost", {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

export default mongo;