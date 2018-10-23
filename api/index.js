import sessionRouter from './session';
import express from 'express';
const router = express.Router();

router.use('/session', sessionRouter);

export default router;
