import { openSessionService } from '../../services/session/openSession.service.js';

export const openSession = async (req, res) => {
  try {
    const { table_id } = req.body;
    if (!table_id) return res.status(400).json({ message: 'table_id is required' });

    const session = await openSessionService({ table_id });
    return res.status(201).json({
      message: 'Session opened successfully',
      data: session
    });
  } catch (error) {
    if (error.message.includes('does not exist')) return res.status(404).json({ message: error.message });
    if (error.message.includes('not available') || error.message.includes('no hourly rate')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};
