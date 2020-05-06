import Express from 'express';
import {createEvent, getUserEvents} from "../../controllers/events";
import protectController from "../../middleware/protectController";

const router = Express.Router();

const EVENTS = 'events';

const ROOT_PATH = `/${EVENTS}`;

export const PATHS = {
    CREATE: `${ROOT_PATH}/create`,
    GET_BY_USER: `${ROOT_PATH}/get-by-user`,
};

router.post(PATHS.CREATE, protectController(createEvent, false));
router.post(PATHS.GET_BY_USER, protectController(getUserEvents, false));
export default router;
