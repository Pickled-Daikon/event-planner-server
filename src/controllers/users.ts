import {Request, Response} from "express";
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
    isIUser,
    insertOne,
    find as findUsers,
    findOne as findUser,
    UserExists, UserNotFound,
} from "../models/User";
import hasShape from "../tools/hasShape";

const SALT_ROUNDS = 10;
const JWT_KEY = process.env.JWT_KEY;
const TOKEN_EXPIRATION = '7d';

if (!JWT_KEY) {
    throw new Error('No jwt key is set in env variables');
}

const ERROR_MSGS = {
    SERVER_ERROR: 'Undefined server Error.',
    NEW_USER_MISSING: 'New user object is either missing, ' +
        'missing props, or props have incorrect type in request body.',
    USER_EXISTS: 'A user already exists with given email',
    USER_NOT_FOUND: 'no user was found.',
    CREDENTIALS_MISSING: 'credentials is of incorrect type in request body. object should have email, password',
    INCORRECT_PW: 'Password is incorrect for given email',
};

interface ILoginCredentials {
  email: string;
  password: string;
}

function isILoginCredentials(obj: any): obj is ILoginCredentials {
    return hasShape(obj, {
        email: {isRequired: true, type: 'string'},
        password: {isRequired: true, type: 'string'}
    })
}

export async function create(req: Request, res: Response): Promise<Response>{
    const newUser = req.body.user;
    if (!isIUser(newUser)) {
        return res.status(400).json({error: ERROR_MSGS.NEW_USER_MISSING});
    }

    let hashedPw;

    try {
        hashedPw = await bycrypt.hash(newUser.password, SALT_ROUNDS);
    } catch (e) {
        return res.status(400).json({error: ERROR_MSGS.SERVER_ERROR});
    }

    newUser.password = hashedPw;

    try {
        const createdUser = await insertOne(newUser);
        return res.status(200).json({user: createdUser});

    } catch (e) {
        if (e instanceof UserExists) {
            return res.status(400).json({error: ERROR_MSGS.USER_EXISTS});
        }
        return res.status(400).json({error: ERROR_MSGS.SERVER_ERROR});
    }
}

export async function getAll(req: Request, res: Response): Promise<Response> {
    try {
        const users = await findUsers({});
        return res.status(400).json({users});
    } catch (e) {
        return res.status(400).json({error: ERROR_MSGS.SERVER_ERROR});
    }
}

export async function login(req: Request, res: Response): Promise<Response> {
    let foundUser;
    let tokenizedUser;

    const credentials = req.body.credentials;
    if (!isILoginCredentials(credentials)) {
        return res.status(400).json({error: ERROR_MSGS.CREDENTIALS_MISSING});
    }

    try {
        foundUser = await findUser({email: credentials.email});
    } catch (e) {
        if (e instanceof UserNotFound) {
            return res.status(400).json({error: ERROR_MSGS.USER_NOT_FOUND});
        } else {
            return res.status(400).json({error: ERROR_MSGS.SERVER_ERROR});
        }
    }

    try {
        const pwMatch = await bycrypt.compare(credentials.password, foundUser.password);
        if (!pwMatch) {
            return res.status(400).json({error: ERROR_MSGS.INCORRECT_PW});
        }
    } catch (e) {
        return res.status(400).json({error: ERROR_MSGS.SERVER_ERROR});
    }

    try {
        tokenizedUser = await jwt.sign(foundUser, JWT_KEY as string, {expiresIn: TOKEN_EXPIRATION});
    } catch (e) {
        return res.status(400).json({error: ERROR_MSGS.SERVER_ERROR});
    }

    return res.status(200).json({token: tokenizedUser});
}
