import { v4 as uuidv4 } from 'uuid';
import { PlayingSession } from '../../models/playingSession.model.js';
import { SessionItems } from '../../models/sessionItems.model.js';
import { Invoices } from '../../models/invoices.model.js';
import { closeSessionService } from '../session/closeSession.service.js';

export const generateInvoiceService = async (sessionId) => {
  let session = await PlayingSession.findOne({ session_id: sessionId });
  if (!session) throw new Error(`Session ${sessionId} does not exist`);

  const existingInvoice = await Invoices.findOne({ session_id: session._id });
  if (existingInvoice) throw new Error(`Invoice for session ${sessionId} already exists`);

  if (session.end_time === null) {
    session = await closeSessionService(sessionId);
    session = await PlayingSession.findOne({ session_id: sessionId });
  }

  const sessionItems = await SessionItems.find({ session_id: session._id });
  const itemsCost = sessionItems.reduce((sum, item) => sum + item.item_total_cost, 0);
  const playingCost = session.total_session_cost;
  const totalAmount = playingCost + itemsCost;

  const invoice = new Invoices({
    invoice_id: uuidv4(),
    session_id: session._id,
    invoice_date: new Date(),
    playing_cost: playingCost,
    items_cost: itemsCost,
    total_amount: totalAmount,
    payment_status: 'Chưa thanh toán'
  });

  await invoice.save();
  return invoice.populate({ path: 'session_id', populate: ['table_id', 'hourly_rate_id'] });
};
