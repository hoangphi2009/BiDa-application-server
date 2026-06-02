import { PlayingSession } from '../../models/playingSession.model.js';

export const getSessionByIdService = async (sessionId) => {
  const session = await PlayingSession.findOne({ session_id: sessionId })
    .populate('table_id')
    .populate('hourly_rate_id');
  if (!session) throw new Error(`Session ${sessionId} does not exist`);
  return session;
};
