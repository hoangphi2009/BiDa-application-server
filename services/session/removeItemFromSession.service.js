import { PlayingSession } from '../../models/playingSession.model.js';
import { SessionItems } from '../../models/sessionItems.model.js';

export const removeItemFromSessionService = async (sessionId, sessionItemId) => {
  const session = await PlayingSession.findOne({ session_id: sessionId });
  if (!session) throw new Error(`Session ${sessionId} does not exist`);
  if (session.end_time !== null) throw new Error(`Session ${sessionId} is already closed`);

  const sessionItem = await SessionItems.findOne({ session_item_id: sessionItemId, session_id: session._id });
  if (!sessionItem) throw new Error(`Session item ${sessionItemId} does not exist`);

  await SessionItems.deleteOne({ session_item_id: sessionItemId });
};
