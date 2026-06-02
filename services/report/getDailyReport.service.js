import { Invoices } from '../../models/invoices.model.js';

export const getDailyReportService = async (date) => {
  if (!date) throw new Error('date là bắt buộc (YYYY-MM-DD)');

  const start = new Date(date);
  if (isNaN(start)) throw new Error('date không hợp lệ, định dạng đúng: YYYY-MM-DD');
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const invoices = await Invoices.find({ invoice_date: { $gte: start, $lte: end } })
    .populate({ path: 'session_id', populate: 'table_id' });

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const totalPlayingCost = invoices.reduce((sum, inv) => sum + (inv.playing_cost || 0), 0);
  const totalItemsCost = invoices.reduce((sum, inv) => sum + (inv.items_cost || 0), 0);
  const paid = invoices.filter(inv => inv.payment_status === 'Đã thanh toán');
  const unpaid = invoices.filter(inv => inv.payment_status === 'Chưa thanh toán');
  const cancelled = invoices.filter(inv => inv.payment_status === 'Hủy');

  return {
    date,
    total_invoices: invoices.length,
    paid_count: paid.length,
    unpaid_count: unpaid.length,
    cancelled_count: cancelled.length,
    total_revenue: totalRevenue,
    total_playing_cost: totalPlayingCost,
    total_items_cost: totalItemsCost,
    invoices
  };
};
