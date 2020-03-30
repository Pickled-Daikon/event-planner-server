import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {IUser} from "../models/User";

const JWT_KEY = process.env.JWT_KEY;
if (!JWT_KEY) {
    throw new Error('No jwt key is set in env variables');
}

type Controller = (req: Request, res: Response) => Response|Promise<Response>;

const ERRORS = {
    MISSING_AUTH_HEADER: 'Authentication header is missing',
    VERIFICATION_FAILED: 'verification failed',
};

export default function protectController(controller: Controller, isAdmin: boolean): Controller{
 return async (req: Request, res: Response) => {
    const authentication = req.headers.authentication;
    if (typeof authentication !== 'string') {
        return res.status(400).json({error: ERRORS.MISSING_AUTH_HEADER});
    }

    let decodedToken: IUser;
    const token = authentication.split(" ")[1];

    try {
        decodedToken = await jwt.verify(token, JWT_KEY as string) as IUser;
    } catch (e) {
        return res.status(400).json({error: ERRORS.VERIFICATION_FAILED});
    }

    if (isAdmin && !decodedToken.isAdmin) {
        return res.status(400).json({error: ERRORS.VERIFICATION_FAILED});
    }
    return controller(req, res);
 }
}
