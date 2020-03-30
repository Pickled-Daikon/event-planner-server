import DotEnv from 'dotenv';
import startServer from './server';
import apiRouter from './routes/api';
import {connect as dbConnect} from "./db";
import Express from 'express';
import cors from 'cors';
import {MissingEnvVars} from "./Errors";

jest.mock('./routes/api');
jest.mock('./db');
jest.mock('cors');

const dotEnvConfigSpy = jest.spyOn(DotEnv, 'config');

beforeEach(() => {
   DotEnv.config();
   jest.clearAllMocks();
   // tslint:disable-next-line:no-console
});

test('server throws if env variables are not defined', async () => {
   expect.assertions(4);
   // @ts-ignore
   dotEnvConfigSpy.mockImplementationOnce(() => {
      process.env = {SERVER_PORT: '3000'};
   });
   try {
      await startServer();
   } catch (e) {
      expect(e).toBeInstanceOf(MissingEnvVars);
      expect(e.message.includes('NODE_ENV')).toBe(true);
   }
   // @ts-ignore
   dotEnvConfigSpy.mockImplementationOnce(() => {
      process.env = {NODE_ENV: 'production'};
   });
   try {
      await startServer();
   } catch (e) {
      expect(e).toBeInstanceOf(MissingEnvVars);
      expect(e.message.includes('SERVER_PORT')).toBe(true);
   }
});

test('DotEnv.config gets called', async () => {
   await startServer();
   expect(dotEnvConfigSpy).toHaveBeenCalledTimes(1);
});

test('express app gets initialized', async () => {
   await startServer();
   expect(Express).toHaveBeenCalledTimes(1);
});

test('db connection attempted', async () => {
   await startServer();
   expect(dbConnect).toHaveBeenCalledTimes(1);
});

test('db connection error gets thrown when connection fails',async () => {
   const dbError = new Error('dbError');
   // @ts-ignore
   dbConnect.mockImplementationOnce(() => {throw dbError});
   expect.assertions(1);
   try {
      await startServer();
   } catch (e) {
      expect(e).toEqual(dbError);
   }


});
test('middleware gets applied', async () => {
   await startServer();
   expect(Express().use).toHaveBeenCalledWith(Express.json());
   expect(Express().use).toHaveBeenCalledWith(cors());
});

test('routes get applied', async () => {
   await startServer();
   expect(Express().use).toHaveBeenCalledWith(apiRouter);
});

test('app.listen gets called with port number', async () => {
   await startServer();
   // @ts-ignore
   expect(Express().listen.mock.calls[0][0]).toEqual(process.env.SERVER_PORT);
});
