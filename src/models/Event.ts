import {getDb} from "../db";
import {findOne as findOneUser, IUser, UserNotFound} from "./User";
import {InsertOneWriteOpResult} from "mongodb";
import {QueryError} from "./errors";
import hasShape from "../tools/hasShape";
export { UserNotFound } from './User';

export const EVENTS = 'events';

// interface keys
const ID = '_id';
const USER_ID = 'userId';
const DESCRIPTION = 'description';
const LOCATION = 'location';
const START_DATE_TIME = 'startDateTime';
const END_DATE_TIME = 'endDateTime';


// string used for dateCheck
const INVALID_DATE = 'Invalid Date';

export interface IEvent {
    _id?: string,
    userId: string,
    name: string,
    description: string,
    location: string,
    startDateTime: string,
    endDateTime: string,
}

export interface IEventQueryFilter {
    _id?: string,
    name?: string,
    userId?: string,
    description?: string,
    location?: string,
    StartDateTime?: string,
    EndDateTime?: string,
}

export async function insertOne(event: IEvent): Promise<IEvent> {

    const db = getDb();
    let queryResult: InsertOneWriteOpResult<IEvent & {_id: string}>;

    try {
        await findOneUser({_id: event.userId});
    } catch (e) {
        throw(e);
    }

    try {
        queryResult = await db.collection(EVENTS).insertOne(event);
    } catch (e) {
        throw new QueryError();
    }

    if (queryResult.insertedCount !== 1) throw new QueryError();

    return queryResult.ops[0];
}

export function isIEvent(obj: any): obj is IEvent {
    const hasCorrectShape = hasShape(obj, {
        [ID]: {isRequired: false, type: 'string'},
        [USER_ID]: {isRequired: true, type: 'string'},
        [DESCRIPTION]: {isRequired: true, type: 'string'},
        [LOCATION]: {isRequired: true, type: 'string'},
        [START_DATE_TIME]: {isRequired: true, type: 'string'},
        [END_DATE_TIME]: {isRequired: true, type: 'string'}
    });

    if (!hasCorrectShape) return false;

    if (new Date(obj[START_DATE_TIME]).toString() === INVALID_DATE) {
        return false;
    }

    if (new Date(obj[END_DATE_TIME]).toString() === INVALID_DATE) {
        return false;
    }
    return true;
}
