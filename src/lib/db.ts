import config from "./config.js";
import { MongoClient, ServerApiVersion } from "mongodb";

export const mongo = new MongoClient(
    config.db?.connectionURI ?? "mongodb://localhost",
    {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    }
);

export async function find(query: any) {
    if (!config.db) throw new Error("No DB Configured!");

    let out = [];
    try {
        await mongo.connect();
        out = await mongo
            .db("notification")
            .collection("connections")
            .find(query)
            .toArray();
    } finally {
        await mongo.close();
    }
    return out;
}

export async function findOne(query: any) {
    if (!config.db) throw new Error("No DB Configured!");

    let out;
    try {
        await mongo.connect();
        out = await mongo
            .db("notification")
            .collection("connections")
            .findOne(query);
    } finally {
        await mongo.close();
    }
    return out;
}

export async function insertOne(doc: any) {
    if (!config.db) throw new Error("No DB Configured!");

    let res;
    try {
        await mongo.connect();
        res = await mongo
            .db("notification")
            .collection("connections")
            .insertOne(doc);
    } finally {
        await mongo.close();
    }
    return res;
}

export async function deleteOne(query: any) {
    if (!config.db) throw new Error("No DB Configured!");

    let res;
    try {
        await mongo.connect();
        res = await mongo
            .db("notification")
            .collection("connections")
            .deleteOne(query);
    } finally {
        await mongo.close();
    }
    return res;
}
