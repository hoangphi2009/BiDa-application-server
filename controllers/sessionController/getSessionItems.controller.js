import { getSessionItemsService } from '../../services/session/getSessionItems.service.js';

export const getSessionItems = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const items = await getSessionItemsService(sessionId);
    return res.status(200).json({ message: `Items in session ${sessionId}`, data: items });
  } catch (error) {
    if (error.message.includes('does not exist')) return res.status(404).json({ message: error.message });
    return res.status(500).json({ message: 'Internal server error' });
  }
};
