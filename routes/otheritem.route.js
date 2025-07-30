import express from 'express';
import { createOtherItem } from '../controllers/otheritemController/createOtherItem.controller.js';
import { getOtherItemController } from '../controllers/otheritemController/getOtherItem.controller.js';
import { getOtherItemByIdController } from '../controllers/otheritemController/getOtherItemById.controller.js';

const router = express.Router();

router.post('/register', createOtherItem);
router.get('/otheritems', getOtherItemController);
router.get('/otheritems/:itemId', getOtherItemByIdController);

export default router;
