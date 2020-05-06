import Express from 'express';
import {createEvent, getUserEvents, getUserEventsByMonth} from "../../controllers/events";
import protectController from "../../middleware/protectController";

const router = Express.Router();

const EVENTS = 'events';

const ROOT_PATH = `/${EVENTS}`;

export const PATHS = {
    CREATE: `${ROOT_PATH}/create`,
    GET_BY_USER: `${ROOT_PATH}/get-by-user`,
    GET_MONTH_BY_USER: `${ROOT_PATH}/get-month-by-user`
};

router.post(PATHS.CREATE, protectController(createEvent, false));
router.post(PATHS.GET_BY_USER, protectController(getUserEvents, false));
router.post(PATHS.GET_MONTH_BY_USER, protectController(getUserEventsByMonth, false));
export default router;
