import {Db, MongoClient} from "mongodb";
import {MissingEnvVars} from "../Errors";

const { DB_URI, DB_NAME } = process.env; // env variables

if (!DB_URI) {
    throw new MissingEnvVars('DB_URI env variable is missing');
}

if (!DB_NAME) {
    throw new MissingEnvVars('DB_NAME env variable is missing');
}

const dbOptions = { useUnifiedTopology: true };

export class ConnectionError extends Error {
  constructor() {
    super('DB connection failed');
  }
}

const mongoClient = new MongoClient(DB_URI as string, dbOptions);
let database: Db;

export async function connect() {
    try {
    await mongoClient.connect();
    database = mongoClient.db(DB_NAME as string);
  } catch (e) {
   throw new ConnectionError();
  }
  return;
}

export function getDb() {
    return database;
}
