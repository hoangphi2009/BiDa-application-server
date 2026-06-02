import { PlayingSession } from '../../models/playingSession.model.js';
import { SessionItems } from '../../models/sessionItems.model.js';

export const getSessionItemsService = async (sessionId) => {
  const session = await PlayingSession.findOne({ session_id: sessionId });
  if (!session) throw new Error(`Session ${sessionId} does not exist`);

  const items = await SessionItems.find({ session_id: session._id }).populate('item_id');
  return items;
};
