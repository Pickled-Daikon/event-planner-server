import protectController from "../../middleware/protectController";
import { createEvent } from "../../controllers/events";

import Express from 'express';

jest.mock('express');
jest.mock('../../middleware/protectController');
jest.mock('../../controllers/events');

const post = jest.fn(() => null);
// @ts-ignore
Express.Router = () => {
    return {
        post
    };
};

const ExpressRouterSpy = jest.spyOn(Express, 'Router');

import {PATHS} from "./events";
import "./events";

test('Express.router gets initialized',  () => {
   expect(ExpressRouterSpy).toBeCalledTimes(1);
});

test('routes are all correctly applied', () => {
   expect(post).toBeCalledTimes(1);
   expect(post).toBeCalledWith(PATHS.CREATE, createEvent);

   expect(protectController).toBeCalledTimes(1);
   expect(protectController).toBeCalledWith(createEvent, false);
});

