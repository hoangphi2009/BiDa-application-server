import express from 'express';
import { generateInvoice } from '../controllers/invoiceController/generateInvoice.controller.js';
import { getInvoiceBySession } from '../controllers/invoiceController/getInvoiceBySession.controller.js';
import { updatePaymentStatus } from '../controllers/invoiceController/updatePaymentStatus.controller.js';

const router = express.Router();

router.post('/generate/:sessionId', generateInvoice);
router.get('/:sessionId', getInvoiceBySession);
router.put('/:invoiceId/payment', updatePaymentStatus);

export default router;
