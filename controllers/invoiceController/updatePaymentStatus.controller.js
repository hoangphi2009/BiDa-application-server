import { updatePaymentStatusService } from '../../services/invoice/updatePaymentStatus.service.js';

export const updatePaymentStatus = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await updatePaymentStatusService(invoiceId, req.body);
    return res.status(200).json({ message: `Invoice ${invoiceId} updated`, data: invoice });
  } catch (error) {
    if (error.message.includes('does not exist')) return res.status(404).json({ message: error.message });
    if (error.message.includes('không hợp lệ')) return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: 'Internal server error' });
  }
};
