import express from 'express';
import { getDailyReport } from '../controllers/reportController/getDailyReport.controller.js';
import { getMonthlyReport } from '../controllers/reportController/getMonthlyReport.controller.js';

const router = express.Router();

router.get('/daily', getDailyReport);
router.get('/monthly', getMonthlyReport);

export default router;
