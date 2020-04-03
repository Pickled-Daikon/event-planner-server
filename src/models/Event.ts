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
    /* has shape not working for this for some reason
    const hasCorrectShape = hasShape(obj, {
        _id: {isRequired: false, type: 'string'},
        userId: {isRequired: true, type: 'string'},
        description: {isRequired: true, type: 'string'},
        location: {isRequired: true, type: 'string'},
        startDateTime: {isRequired: true, type: 'string'},
        endDateTime: {isRequired: true, type: 'string'}
    });
    */

    // quick fix since hasShape is not working;
    if (!obj.userId || typeof obj.userId !== 'string') {
        return false;
    }

    if (!obj.description || typeof obj.description !== 'string') {
        return false;
    }

    if (!obj.location || typeof obj.location !== 'string') {
        return false;
    }

    if (!obj.startDateTime || typeof obj.startDateTime !== 'string') {
        return false;
    }

    if (!obj.endDateTime || typeof obj.endDateTime !== 'string') {
        return false;
    }


    if (new Date(obj[START_DATE_TIME]).toString() === INVALID_DATE) {
        return false;
    }

    if (new Date(obj[END_DATE_TIME]).toString() === INVALID_DATE) {
        return false;
    }
    return true;
}
