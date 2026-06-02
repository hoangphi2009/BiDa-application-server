import express from 'express';
import { getAllItems } from '../controllers/itemController/getAllItems.controller.js';
import { getItemById } from '../controllers/itemController/getItemById.controller.js';
import { createItem } from '../controllers/itemController/createItem.controller.js';
import { updateItem } from '../controllers/itemController/updateItem.controller.js';
import { deleteItem } from '../controllers/itemController/deleteItem.controller.js';

const router = express.Router();

router.get('/items', getAllItems);
router.get('/items/:itemId', getItemById);
router.post('/register', createItem);
router.put('/update/:itemId', updateItem);
router.delete('/delete/:itemId', deleteItem);

export default router;
