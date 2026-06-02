import express from 'express';
import { openSession } from '../controllers/sessionController/openSession.controller.js';
import { closeSession } from '../controllers/sessionController/closeSession.controller.js';
import { getAllSessions } from '../controllers/sessionController/getAllSessions.controller.js';
import { getSessionById } from '../controllers/sessionController/getSessionById.controller.js';
import { addItemToSession } from '../controllers/sessionController/addItemToSession.controller.js';
import { getSessionItems } from '../controllers/sessionController/getSessionItems.controller.js';
import { removeItemFromSession } from '../controllers/sessionController/removeItemFromSession.controller.js';

const router = express.Router();

router.post('/open', openSession);
router.put('/close/:sessionId', closeSession);
router.get('/sessions', getAllSessions);
router.get('/sessions/:sessionId', getSessionById);

router.post('/:sessionId/items', addItemToSession);
router.get('/:sessionId/items', getSessionItems);
router.delete('/:sessionId/items/:sessionItemId', removeItemFromSession);

export default router;
