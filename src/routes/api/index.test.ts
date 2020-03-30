import usersRouter from './users';
import Express from 'express';

jest.mock('./users');
jest.mock('express');

const use = jest.fn(() => null);
// @ts-ignore
Express.Router = () => {
    return {
        use,
    };
};
const routerConstructorSpy = jest.spyOn(Express, 'Router');

import "./index";
import {API} from "./index";


test('api router is initialized', () => {
    expect(routerConstructorSpy).toBeCalledTimes(1);
});

test('api routers are applied to central router', () => {
    expect(use).toBeCalledTimes(1);
    expect(use).toBeCalledWith(`/${API}`, usersRouter);
});
