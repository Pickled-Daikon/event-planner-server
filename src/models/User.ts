import {getDb} from "../db";
import {QueryError} from "./errors";
import { InsertOneWriteOpResult, ObjectID } from "mongodb";
import hasShape from "../tools/hasShape";

const USERS = 'users'; // collection name

// interface keys
const ID = '_id';
const FIRST_NAME = 'firstName';
const LAST_NAME = 'lastName';
const EMAIL = 'email';
const PASSWORD = 'password';
const IS_ADMIN = 'isAdmin';

export class UserExists extends Error {
    constructor() {
        super('User already exists with given email');
    }
}

export class UserNotFound extends Error {
    constructor() {
        super('No user was found');
    }
}

export interface IUser {
    _id?: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isAdmin: boolean,
}

export interface IUserQueryFilter {
    _id?: string | ObjectID,
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    isAdmin?: boolean,
}

export async function findOne(filter: IUserQueryFilter): Promise<IUser> {
    let foundUser: IUser|null = null;
    const db = getDb();

    if (filter._id && typeof filter._id === 'string') {
        filter._id = new ObjectID(filter._id);
    }
    try {
        foundUser = await db.collection(USERS).findOne(filter);
    } catch (e) {
        throw new QueryError();
    }

    if (!foundUser) {
        throw new UserNotFound();
    }
    return foundUser;
}

export async function insertOne(user: IUser): Promise<IUser>  {
    const db = getDb();
    let foundUser: IUser|null;
    let queryResult: InsertOneWriteOpResult<IUser & {_id: string}>;

    try {
        foundUser = await findOne({email: user.email});
    } catch (e) {
        if (e instanceof QueryError) {
            throw(e);
        }
        foundUser = null;
    }

    if (foundUser) {
        throw new UserExists();
    }

    try {
        queryResult = await db.collection(USERS).insertOne(user);
    } catch (e) {
        throw new QueryError();
    }
    if (queryResult.insertedCount !== 1) {
        throw new QueryError();
    }
    return queryResult.ops[0];
}

export async function find(filter: IUserQueryFilter): Promise<IUser[]> {
    const db = getDb();
    let foundUsers: IUser[];
    try {
        foundUsers = await db.collection(USERS).find(filter).toArray();
        return foundUsers;
    } catch (e) {
        throw new QueryError();
    }
}


export function isIUser(obj: any): obj is IUser {
    return hasShape(obj, {
        [ID]: {isRequired: false, type: 'string'},
        [FIRST_NAME]: {isRequired: true, type: 'string'},
        [LAST_NAME]: {isRequired: true, type: 'string'},
        [EMAIL]: {isRequired: true, type: 'string'},
        [PASSWORD]: {isRequired: true, type: 'string'},
        [IS_ADMIN]: {isRequired: true, type: 'boolean'},
    })
}

