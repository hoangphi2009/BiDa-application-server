import { Invoices } from '../../models/invoices.model.js';

export const getMonthlyReportService = async (year, month) => {
  if (!year || !month) throw new Error('year và month là bắt buộc');

  const y = parseInt(year);
  const m = parseInt(month);
  if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
    throw new Error('year hoặc month không hợp lệ');
  }

  const start = new Date(y, m - 1, 1, 0, 0, 0, 0);
  const end = new Date(y, m, 0, 23, 59, 59, 999);

  const invoices = await Invoices.find({ invoice_date: { $gte: start, $lte: end } })
    .populate({ path: 'session_id', populate: 'table_id' });

  // Group theo từng ngày
  const dailyMap = {};
  for (const inv of invoices) {
    const day = new Date(inv.invoice_date).toISOString().slice(0, 10);
    if (!dailyMap[day]) {
      dailyMap[day] = { date: day, total_invoices: 0, total_revenue: 0, playing_cost: 0, items_cost: 0 };
    }
    dailyMap[day].total_invoices += 1;
    dailyMap[day].total_revenue += inv.total_amount || 0;
    dailyMap[day].playing_cost += inv.playing_cost || 0;
    dailyMap[day].items_cost += inv.items_cost || 0;
  }

  const dailyBreakdown = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const totalPlayingCost = invoices.reduce((sum, inv) => sum + (inv.playing_cost || 0), 0);
  const totalItemsCost = invoices.reduce((sum, inv) => sum + (inv.items_cost || 0), 0);
  const paid = invoices.filter(inv => inv.payment_status === 'Đã thanh toán').length;
  const unpaid = invoices.filter(inv => inv.payment_status === 'Chưa thanh toán').length;
  const cancelled = invoices.filter(inv => inv.payment_status === 'Hủy').length;

  return {
    year: y,
    month: m,
    total_invoices: invoices.length,
    paid_count: paid,
    unpaid_count: unpaid,
    cancelled_count: cancelled,
    total_revenue: totalRevenue,
    total_playing_cost: totalPlayingCost,
    total_items_cost: totalItemsCost,
    daily_breakdown: dailyBreakdown
  };
};
