import express from 'express';
import { openSession } from '../controllers/sessionController/openSession.controller.js';
import { closeSession } from '../controllers/sessionController/closeSession.controller.js';
import { getAllSessions } from '../controllers/sessionController/getAllSessions.controller.js';
import { getSessionById } from '../controllers/sessionController/getSessionById.controller.js';

const router = express.Router();

router.post('/open', openSession);
router.put('/close/:sessionId', closeSession);
router.get('/sessions', getAllSessions);
router.get('/sessions/:sessionId', getSessionById);

export default router;
