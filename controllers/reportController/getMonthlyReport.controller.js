import { getMonthlyReportService } from '../../services/report/getMonthlyReport.service.js';

export const getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const report = await getMonthlyReportService(year, month);
    return res.status(200).json({ message: `Báo cáo doanh thu tháng ${month}/${year}`, data: report });
  } catch (error) {
    if (error.message.includes('bắt buộc') || error.message.includes('không hợp lệ')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};
