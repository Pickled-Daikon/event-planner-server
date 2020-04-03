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

    if (!isEvent) {
        return res.status(400).json({error: ERROR_MSGS.BAD_EVENT_GIVEN});
    }

    try {
        const newEvent = await Event.insertOne(event);
        return res.status(200).json({event: newEvent});
    } catch (e) {
        return res.status(400).json({error: ERROR_MSGS.SERVER_ERROR});
    }
}

