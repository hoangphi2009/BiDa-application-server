import express from 'express';
import { createOtherItem } from '../controllers/otheritemController/createOtherItem.controller.js';

const router = express.Router();

router.post('/register', createOtherItem);

export default router;
