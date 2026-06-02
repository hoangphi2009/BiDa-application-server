import { PlayingSession } from '../../models/playingSession.model.js';
import { Invoices } from '../../models/invoices.model.js';
import { SessionItems } from '../../models/sessionItems.model.js';

export const getInvoiceBySessionService = async (sessionId) => {
  const session = await PlayingSession.findOne({ session_id: sessionId });
  if (!session) throw new Error(`Session ${sessionId} does not exist`);

  const invoice = await Invoices.findOne({ session_id: session._id })
    .populate({ path: 'session_id', populate: ['table_id', 'hourly_rate_id'] });
  if (!invoice) throw new Error(`Invoice for session ${sessionId} does not exist`);

  const sessionItems = await SessionItems.find({ session_id: session._id }).populate('item_id');

  return { invoice, sessionItems };
};
