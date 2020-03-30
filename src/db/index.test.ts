// @ts-ignore
import {MongoClient, MongoClientConnect, MongoClientDb} from "mongodb";
import DotEnv from 'dotenv';
DotEnv.config();

const { DB_URI, DB_NAME } = process.env; // env variables

jest.mock('mongodb');


import {ConnectionError, connect, getDb} from "./index";

test('mongoClient constructor gets called', () => {
    expect(MongoClient).toBeCalledTimes(1);
    expect(MongoClient).toBeCalledWith(DB_URI, {useUnifiedTopology: true});
});

test('connect() calls MongoClient.connect()', async () => {
    expect.assertions(1);
    MongoClientConnect.mockRestore();
    await connect();
    expect(MongoClientConnect).toBeCalledTimes(1);
    return;
});

test('connect() calls MongoClient.db() correctly', async () => {
    expect.assertions(2);
    MongoClientDb.mockRestore();
    await connect();
    expect(MongoClientDb).toBeCalledTimes(1);
    expect(MongoClientDb).toBeCalledWith(DB_NAME);
});

test('connect() throws connectionError if MongoClient.connect() failed', async () => {
    expect.assertions(1);
    MongoClientConnect.mockImplementationOnce(() => new Promise(((resolve, reject) => reject())));
    try {
        await connect();
    } catch (e) {
        expect(e).toBeInstanceOf(ConnectionError);
    }
});
