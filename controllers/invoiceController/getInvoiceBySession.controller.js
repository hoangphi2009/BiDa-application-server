import { getInvoiceBySessionService } from '../../services/invoice/getInvoiceBySession.service.js';

export const getInvoiceBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await getInvoiceBySessionService(sessionId);
    return res.status(200).json({ message: `Invoice for session ${sessionId}`, data: result });
  } catch (error) {
    if (error.message.includes('does not exist')) return res.status(404).json({ message: error.message });
    return res.status(500).json({ message: 'Internal server error' });
  }
};
