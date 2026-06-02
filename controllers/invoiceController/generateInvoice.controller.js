import { generateInvoiceService } from '../../services/invoice/generateInvoice.service.js';

export const generateInvoice = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const invoice = await generateInvoiceService(sessionId);
    return res.status(201).json({ message: 'Invoice generated successfully', data: invoice });
  } catch (error) {
    if (error.message.includes('does not exist')) return res.status(404).json({ message: error.message });
    if (error.message.includes('already exists')) return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: 'Internal server error' });
  }
};
