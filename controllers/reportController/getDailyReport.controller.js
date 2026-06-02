import { getDailyReportService } from '../../services/report/getDailyReport.service.js';

export const getDailyReport = async (req, res) => {
  try {
    const { date } = req.query;
    const report = await getDailyReportService(date);
    return res.status(200).json({ message: `Báo cáo doanh thu ngày ${date}`, data: report });
  } catch (error) {
    if (error.message.includes('bắt buộc') || error.message.includes('không hợp lệ')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};
