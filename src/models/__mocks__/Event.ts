export const insertOne = jest.fn(() => new Promise((resolve => resolve({}))));
export const isIEvent = jest.fn(() => true);

export interface IEvent {
    _id?: string,
    userId: string,
    name: string,
    description: string,
    location: string,
    startDateTime: string,
    endDateTime: string,
}
