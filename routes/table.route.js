import express from 'express';
import { createTable } from '../controllers/tableController/createTable.controller.js';
import { deletedTable } from '../controllers/tableController/deleteTable.controller.js';
import { getAllTables } from '../controllers/tableController/getAllTable.controller.js';
import { getTableById } from '../controllers/tableController/getTableById.controller.js';

const router = express.Router();
router.post('/register', createTable);
router.delete('/delete/:tableId', deletedTable);
router.get('/tables', getAllTables);
router.get('/tables/:tableId', getTableById);
export default router;
