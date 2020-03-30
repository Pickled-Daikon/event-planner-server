import {createEvent, ERROR_MSGS} from './events';
import * as Event from '../models/Event';
import {IEvent} from "../models/Event";

jest.mock('../models/Event');

const fakeEvent: IEvent = {
    userId: '1d',
    name: 'A fake event',
    description: 'Event description',
    location: 'Holmes',
    startDateTime: 'Mon Mar 30 2020 12:42:45 GMT-1000 (Hawaii-Aleutian Standard Time)',
    endDateTime: 'Mon Mar 30 2020 13:42:45 GMT-1000 (Hawaii-Aleutian Standard Time)',
};

test('createEvent checks that event is of type IEvent in requestBody at runtime', async () => {
    expect.assertions(2);
    // @ts-ignore
    await createEvent({body: {event: fakeEvent}}, {});
    expect(Event.isIEvent).toBeCalledTimes(1);
    expect(Event.isIEvent).toBeCalledWith(fakeEvent);
});

