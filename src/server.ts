import Express from 'express'
// middleware
import cors from 'cors';
import DotEnv from 'dotenv';
DotEnv.config(); // have to call config before files have access to env vars.
import {MissingEnvVars} from "./Errors";

import {connect as dbConnect, ConnectionError} from "./db";
import apiRouter from './routes/api';


export default async function start() {
    // load env variables from .env file
    DotEnv.config();
    const { SERVER_PORT, NODE_ENV } = process.env; // env variables

    if (!SERVER_PORT) {
        throw new MissingEnvVars('Missing env variable: SERVER_PORT');
    }

    if (!NODE_ENV) {
        throw new MissingEnvVars('Missing env variable: NODE_ENV');
    }

    // load app
    const app = Express();

    try {
        await dbConnect();
    } catch (e) {
        throw e; // throws ConnectionError
    }

    // apply middleware
    app.use(Express.json());

    if (NODE_ENV === 'development') {
        app.use(cors());
    }

// apply routes
    app.use(apiRouter);


// tslint:disable-next-line:no-console
    app.listen(SERVER_PORT, () => console.log(`Example app listening on port ${SERVER_PORT}`));

}

export {ConnectionError, MissingEnvVars};
