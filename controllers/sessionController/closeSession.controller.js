import { closeSessionService } from '../../services/session/closeSession.service.js';

export const closeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await closeSessionService(sessionId);
    return res.status(200).json({
      message: 'Session closed successfully',
      data: session
    });
  } catch (error) {
    if (error.message.includes('does not exist')) return res.status(404).json({ message: error.message });
    if (error.message.includes('already closed')) return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: 'Internal server error' });
  }
};
