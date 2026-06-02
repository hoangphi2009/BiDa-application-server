import { getAllSessionsService } from '../../services/session/getAllSessions.service.js';

export const getAllSessions = async (req, res) => {
  try {
    const { tableId, date, status } = req.query;
    const sessions = await getAllSessionsService({ tableId, date, status });
    return res.status(200).json({
      message: 'List of all sessions',
      data: sessions
    });
  } catch (error) {
    if (error.message.includes('does not exist')) return res.status(404).json({ message: error.message });
    return res.status(500).json({ message: 'Internal server error' });
  }
};
