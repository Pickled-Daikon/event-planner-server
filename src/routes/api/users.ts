import Express from 'express';
import { create, login, getAll } from "../../controllers/users";
import protectController from "../../middleware/protectController";

const router = Express.Router();

const USERS = 'users';

const ROOT_PATH = `/${USERS}`;

export const PATHS = {
    CREATE: `${ROOT_PATH}/create`,
    LOGIN: `${ROOT_PATH}/login`,
    GET_ALL:   `${ROOT_PATH}/get-all`,
};

router.post(PATHS.CREATE, create);
router.post(PATHS.GET_ALL, protectController(getAll, true));
router.post(PATHS.LOGIN, login);

export default router;
