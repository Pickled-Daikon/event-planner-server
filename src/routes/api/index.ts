import Express from 'express';
import usersRouter from './users';

const router = Express.Router();

export const API = 'api';

router.use(`/${API}`, usersRouter);

export default router;
