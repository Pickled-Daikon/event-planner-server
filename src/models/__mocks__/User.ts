import {IUser} from "../User";

const fakeUser: IUser = {
    _id: 'fakeid',
    email: 'foo@bar.com',
    firstName: 'Foo',
    lastName: 'bar',
    isAdmin: false,
    password: 'asdfasdfsgdasf',
};
export const findOne = jest.fn(() => new Promise(resolve => resolve(fakeUser)));

export class UserNotFound extends Error {}
