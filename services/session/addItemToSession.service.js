import { v4 as uuidv4 } from 'uuid';
import { PlayingSession } from '../models/playingSession.model.js';
import { OtherItem } from '../models/otherItem.model.js';
import { SessionItems } from '../models/sessionItems.model.js';

export const addItemToSessionService = async (sessionId, { item_id, quantity }) => {
  if (!item_id || !quantity || quantity < 1) {
    throw new Error('item_id và quantity (>= 1) là bắt buộc');
  }

  const session = await PlayingSession.findOne({ session_id: sessionId });
  if (!session) throw new Error(`Session ${sessionId} does not exist`);
  if (session.end_time !== null) throw new Error(`Session ${sessionId} is already closed`);

  const item = await OtherItem.findOne({ item_id });
  if (!item) throw new Error(`Item ${item_id} does not exist`);

  const unitPrice = item.price;
  const itemTotalCost = unitPrice * quantity;

  const sessionItem = new SessionItems({
    session_id: session._id,
    session_item_id: uuidv4(),
    item_id: item._id,
    unit_price: unitPrice,
    total_items: quantity,
    item_total_cost: itemTotalCost
  });

  await sessionItem.save();
  return sessionItem.populate('item_id');
};
