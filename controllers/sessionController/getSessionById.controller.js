import { getSessionByIdService } from '../../services/session/getSessionById.service.js';

export const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await getSessionByIdService(sessionId);
    return res.status(200).json({
      message: `Session ${sessionId} found`,
      data: session
    });
  } catch (error) {
    if (error.message.includes('does not exist')) return res.status(404).json({ message: error.message });
    return res.status(500).json({ message: 'Internal server error' });
  }
};
