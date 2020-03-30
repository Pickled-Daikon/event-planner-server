import {Request, Response} from "express";
import * as Event from "../models/Event";

export const ERROR_MSGS = {
    SERVER_ERROR: 'Undefined server Error.',
    BAD_EVENT_GIVEN: 'New event object is either missing, ' +
        'missing props, or props have incorrect type in request body.',
};

export async function createEvent(req: Request, res: Response): Promise<Response> {
    const event = req.body.event;
    const isEvent = Event.isIEvent(event);

    return res;
}
