import { addItemToSessionService } from '../../services/session/addItemToSession.service.js';

export const addItemToSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessionItem = await addItemToSessionService(sessionId, req.body);
    return res.status(201).json({ message: 'Item added to session', data: sessionItem });
  } catch (error) {
    if (error.message.includes('does not exist')) return res.status(404).json({ message: error.message });
    if (error.message.includes('already closed') || error.message.includes('bắt buộc')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};
