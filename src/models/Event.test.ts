import * as db from '../db';
import * as mockDb from '../db/__mocks__/';

import * as User from './User';
import * as mockUser from './__mocks__/User';

const {getDb} = db as unknown as typeof mockDb;
const {findOne: findOneUser} = User as unknown as typeof mockUser;

import hasShape from "../tools/hasShape";

jest.mock('../db');
jest.mock('./User');
jest.mock('../tools/hasShape');

import {EVENTS, IEvent, insertOne, isIEvent} from './Event';
import {UserNotFound} from "./User";
import {QueryError} from "./errors";



const dbCollection = getDb().collection();

const dbFindOne = dbCollection.findOne;
const dbInsertOne = dbCollection.insertOne;

const fakeEvent: IEvent = {
    userId: '1d',
    name: 'A fake event',
    description: 'Event description',
    location: 'Holmes',
    startDateTime: 'Mon Mar 30 2020 12:42:45 GMT-1000 (Hawaii-Aleutian Standard Time)',
    endDateTime: 'Mon Mar 30 2020 13:42:45 GMT-1000 (Hawaii-Aleutian Standard Time)',
};


afterEach(() => {
    jest.restoreAllMocks();
});

test('insertOne calls getdb()', async () => {
    expect.assertions(1);
    await insertOne(fakeEvent);
    expect(getDb).toBeCalledTimes(2);
});

test('insertOne tries to fetch user with event.userId.', async () => {
    expect.assertions(1);
    await insertOne(fakeEvent);

    expect(findOneUser).toBeCalledWith({_id: fakeEvent.userId});
});

test('insertOne throws correct error when User.findOne throws error', async () => {
    expect.assertions(2);
    const userNotFound = new UserNotFound();
    const queryError = new QueryError();

    // throws userNotFound
    findOneUser.mockImplementationOnce(() => new Promise((resolve, reject) => {reject(userNotFound)}));

    try {
        await insertOne(fakeEvent);
    } catch (e) {
        expect(e).toEqual(userNotFound);
    }

    // throws queryError
    findOneUser.mockImplementationOnce(() => new Promise((resolve, reject) => reject(queryError)));

    try {
        await insertOne(fakeEvent);
    } catch (e) {
        expect(e).toEqual(queryError);
    }
});

test('insertOne calls dbInsertOne correctly', async () => {
    expect.assertions(2);

    await insertOne(fakeEvent);


    expect(getDb().collection).toBeCalledWith(EVENTS);
    expect(dbInsertOne).toBeCalledWith(fakeEvent);
});

test('insertOne throws queryError if dbInsertOne fails.', async () => {
   expect.assertions(2);

   // check when dbInsertOne just fails
   dbInsertOne.mockImplementationOnce(() => new Promise((resolve, reject) => reject({})));
   try {
       await insertOne(fakeEvent);
   } catch (e) {
       expect(e).toBeInstanceOf(QueryError);
   }

   // check when dbInsertOne returns a querySet where insertedCount != 1
    dbInsertOne.mockImplementationOnce(() => new Promise(resolve => resolve({insertedCount: 2})));
    try {
       await insertOne(fakeEvent);
    } catch (e) {
       expect(e).toBeInstanceOf(QueryError);
    }
});

test('insertOne returns correct value', async () => {
    expect.assertions(1);
    dbInsertOne.mockImplementationOnce(() => new Promise(resolve => resolve({
        insertedCount: 1,
        ops: [fakeEvent],
    })));
    const returnValue = await insertOne(fakeEvent);
    expect(returnValue).toEqual(fakeEvent);
});

test('isIEvent calls hasShape with correct shape', () => {
    isIEvent(fakeEvent);
    expect(hasShape).toBeCalledTimes(1);
    expect(hasShape).toBeCalledWith(fakeEvent, {
        _id: {isRequired: false, type: 'string'},
        userId: {isRequired: true, type: 'string'},
        description: {isRequired: true, type: 'string'},
        location: {isRequired: true, type: 'string'},
        startDateTime: {isRequired: true, type: 'string'},
        endDateTime: {isRequired: true, type: 'string'}
    });
});

test('isIEvent returns false when object has a bad Datetime', () => {
    const badEvent1 = {...fakeEvent, startDateTime: 'foo'};
    const badEvent2 = {...fakeEvent, endDateTime: 'bar'};

    expect(isIEvent(badEvent1)).toBe(false);
    expect(isIEvent(badEvent2)).toBe(false);

});
