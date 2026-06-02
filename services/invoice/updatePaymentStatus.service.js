import { Invoices } from '../../models/invoices.model.js';

const VALID_STATUSES = ['Chưa thanh toán', 'Đã thanh toán', 'Hủy'];

export const updatePaymentStatusService = async (invoiceId, { payment_status, notes }) => {
  const invoice = await Invoices.findOne({ invoice_id: invoiceId });
  if (!invoice) throw new Error(`Invoice ${invoiceId} does not exist`);

  if (!VALID_STATUSES.includes(payment_status)) {
    throw new Error(`Trạng thái không hợp lệ. Chỉ chấp nhận: ${VALID_STATUSES.join(', ')}`);
  }

  invoice.payment_status = payment_status;
  if (notes !== undefined) invoice.notes = notes;
  await invoice.save();
  return invoice;
};
