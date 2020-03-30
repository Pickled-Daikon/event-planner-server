import * as db from '../db';
import * as mockDb from '../db/__mocks__/';

const {getDb} = db as unknown as typeof mockDb;

jest.mock('../db');

import {find, findOne, insertOne, UserNotFound, UserExists} from "./User";
import {QueryError} from "./errors";

beforeEach(() => {
    jest.restoreAllMocks();
});

const testUser = {
    firstName: 'Fake',
    lastName: 'User',
    email: 'foo@bar.com',
    password: 'pw',
    isAdmin: true,
};

const genericPromiseConstr = (obj: any) => new Promise((resolve => resolve(obj)));
const promiseResolvingWithUserConstr = () => new Promise((resolve => resolve(testUser)));
const failedPromiseConstr = () => new Promise(((resolve, reject) => reject({})));

const dbCollection = getDb().collection();

const dbFindOne = dbCollection.findOne;
const dbInsertOne = dbCollection.insertOne;


test('findOne calls getDb', async () => {
    expect.assertions(1);
    // @ts-ignore
    dbFindOne.mockImplementationOnce(genericPromiseConstr);

    try {
        await findOne(testUser);
        // tslint:disable-next-line:no-empty
    } catch (e) {
    }

    // twice, since one is called to get mock fn.
    expect(getDb).toBeCalledTimes(2);
});


test('findOne returns correct value', async () => {
    expect.assertions(1);
    const expectedReturnVal = {foo: 'bar'};

    // @ts-ignore
    dbFindOne.mockImplementationOnce(() => new Promise((resolve => resolve(expectedReturnVal))));
    try {
        const returnVal = await findOne(testUser);
        expect(expectedReturnVal).toEqual(returnVal);
    } catch (e) {}

});


test('findOne throws QueryError when getDb.collection.findOne fails', async () => {
    expect.assertions(1);
    getDb().collection().findOne.mockImplementationOnce(() => {
        return new Promise((resolve, reject) => reject({}));
    });

    try {
        await findOne(testUser);
    } catch (e) {
        expect(e).toBeInstanceOf(QueryError);
    }
});

test('findOne throws UserNotFound when getDb.collection.findOne returns no user', async () => {
    expect.assertions(1);
    getDb().collection().findOne.mockImplementationOnce(() => {
        return new Promise(resolve => resolve(null));
    });
    try {
        await findOne(testUser);
    } catch (e) {
        expect(e).toBeInstanceOf(UserNotFound);
    }
});


test('insertOne fails when user with same email already exists', async () => {
    expect.assertions(1);
    dbFindOne.mockRestore();
    dbFindOne.mockImplementationOnce(() => {
        return new Promise(resolve => resolve(testUser));
    });

    try {
        await insertOne(testUser);
    } catch (e) {
        expect(e).toBeInstanceOf(UserExists);
    }
});

test('insertOne throws Query error when findOne throws queryError', async () => {
   expect.assertions(2);
    dbFindOne.mockImplementationOnce(() => {
        return new Promise((resolve, reject) => reject({}));
    });

    try {
        await insertOne(testUser);
    } catch (e) {
        expect(e).toBeInstanceOf(QueryError);
    }
    expect(dbFindOne).toBeCalledWith({email: testUser.email});
});

test('insertOne throws Query error when db.collections.insertOne throws queryError', async () => {
   expect.assertions(2);

    dbInsertOne.mockImplementationOnce(() => {
       return new Promise((resolve, reject) => reject({}));
   });
   try {
       await insertOne(testUser);
   } catch (e) {
       expect(e).toBeInstanceOf(QueryError);
   }
   expect(dbInsertOne).toBeCalledWith(testUser);
});

test('insertOne throws Query error when inserted count != 1', async () => {
    expect.assertions(1);
    dbFindOne.mockImplementationOnce(() => new Promise(resolve => resolve(null)));
    dbInsertOne.mockImplementationOnce(() =>  new Promise(resolve => resolve({insertedCount: 0})));
    try {
        await insertOne(testUser);
    } catch (e) {
        expect(e).toBeInstanceOf(QueryError);
    }
});

test('insertOne returns correct value', async () => {
   expect.assertions(1);
    dbFindOne.mockImplementationOnce(() => new Promise(resolve => resolve(null)));
    dbInsertOne.mockImplementationOnce(() =>  new Promise(resolve => resolve({
        insertedCount: 1,
        ops: [testUser],
    })));

    const returnValue = await insertOne(testUser);
    expect(returnValue).toEqual(returnValue);
});
