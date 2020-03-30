import protectController from "../../middleware/protectController";
import { create, login, getAll } from "../../controllers/users";

import Express from 'express';

jest.mock('express');
jest.mock('../../middleware/protectController');
jest.mock('../../controllers/users');

const post = jest.fn(() => null);
// @ts-ignore
Express.Router = () => {
    return {
        post
    };
};

import {PATHS} from "./users";
import "./users";


test('routes are all correctly applied', () => {
    expect(post).toBeCalledTimes(3);
    expect(post).toBeCalledWith(PATHS.LOGIN, login);
    expect(post).toBeCalledWith(PATHS.CREATE, create);
    expect(post).toBeCalledWith(PATHS.GET_ALL, getAll);
});

test('routes are all correctly protected', () => {
    expect(protectController).toBeCalledTimes(1);
    expect(protectController).toBeCalledWith(getAll, true);
});

