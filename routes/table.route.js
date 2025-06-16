import express from 'express';
import { createTable } from '../controllers/tableController/createTable.controller.js';

const router = express.Router();
router.post('/register', createTable);
export default router;
