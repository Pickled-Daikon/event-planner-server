import {createEvent, ERROR_MSGS} from './events';
import * as Event from '../models/Event';
import * as MockEvent from '../models/__mocks__/Event';

const {isIEvent, insertOne} = Event as unknown as typeof MockEvent;

jest.mock('../models/Event');

afterEach(() => {
    jest.clearAllMocks();
});

const fakeEvent = {
    userId: '1d',
    name: 'A fake event',
    description: 'Event description',
    location: 'Holmes',
    startDateTime: 'Mon Mar 30 2020 12:42:45 GMT-1000 (Hawaii-Aleutian Standard Time)',
    endDateTime: 'Mon Mar 30 2020 13:42:45 GMT-1000 (Hawaii-Aleutian Standard Time)',
};

const res = {
    status() {return this},
    json() {return this},
};

const reqStatusSpy = jest.spyOn(res, 'status');
const reqJsonSpy = jest.spyOn(res, 'json');

test('createEvent checks that event is of type IEvent in requestBody at runtime', async () => {
    expect.assertions(2);
    // @ts-ignore
    await createEvent({body: {event: fakeEvent}}, res);
    expect(Event.isIEvent).toBeCalledTimes(1);
    expect(Event.isIEvent).toBeCalledWith(fakeEvent);
});

test('createEvent throws 404 if req.body.event is not of type IEvent', async () => {
    expect.assertions(4);

    isIEvent.mockImplementationOnce(() => {
        return false;
    });

    // @ts-ignore
    await createEvent({ body: {event: fakeEvent}}, res);

    expect(reqStatusSpy).toBeCalledTimes(1);
    expect(reqStatusSpy).toBeCalledWith(400);

    expect(reqJsonSpy).toBeCalledTimes(1);
    expect(reqJsonSpy).toBeCalledWith({error: ERROR_MSGS.BAD_EVENT_GIVEN});
});

test('createEvent calls Event.insertOne correctly and returns correct value on success', async () => {
    expect.assertions(6);

    const fakeNewEvent = {foo: 'bar'};
    insertOne.mockImplementationOnce(() => new Promise((resolve => resolve(fakeNewEvent))));

    // @ts-ignore
    await createEvent({body: {event: fakeEvent}}, res);

    expect(insertOne).toBeCalledTimes(1);
    expect(insertOne).toBeCalledWith(fakeEvent);

    expect(reqStatusSpy).toBeCalledTimes(1);
    expect(reqStatusSpy).toBeCalledWith(200);

    expect(reqJsonSpy).toBeCalledTimes(1);
    expect(reqJsonSpy).toBeCalledWith({event: fakeNewEvent});
});

test('createEvent returns server error message when insertOne fails', async () => {
    expect.assertions(4);

    insertOne.mockImplementationOnce(() => new Promise(((resolve, reject) => reject({}))));

    // @ts-ignore
    await createEvent({body: {event: fakeEvent}}, res);

    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(400);

    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({error: ERROR_MSGS.SERVER_ERROR});
});

