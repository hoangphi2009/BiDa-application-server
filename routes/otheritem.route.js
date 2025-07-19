import express from 'express';
import { createOtherItem } from '../controllers/otheritemController/createOtherItem.controller.js';

const router = express.Router();

router.post('/otheritems', createOtherItem);

export default router;
