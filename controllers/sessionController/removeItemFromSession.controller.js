import { removeItemFromSessionService } from '../../services/removeItemFromSession.service.js';

export const removeItemFromSession = async (req, res) => {
  try {
    const { sessionId, sessionItemId } = req.params;
    await removeItemFromSessionService(sessionId, sessionItemId);
    return res.status(200).json({ message: `Item ${sessionItemId} removed from session ${sessionId}` });
  } catch (error) {
    if (error.message.includes('does not exist')) return res.status(404).json({ message: error.message });
    if (error.message.includes('already closed')) return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: 'Internal server error' });
  }
};
