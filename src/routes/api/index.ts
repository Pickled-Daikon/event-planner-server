import Express from 'express';
import usersRouter from './users';
import eventsRouter from './events';

const router = Express.Router();

export const API = 'api';

router.use(`/${API}`, usersRouter);
router.use(`/${API}`, eventsRouter);

export default router;
