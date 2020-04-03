import Express from 'express';
import {createEvent} from "../../controllers/events";
import protectController from "../../middleware/protectController";

const router = Express.Router();

const EVENTS = 'events';

const ROOT_PATH = `/${EVENTS}`;

export const PATHS = {
    CREATE: `${ROOT_PATH}/create`,
};

router.post(PATHS.CREATE, protectController(createEvent, false));

export default router;
