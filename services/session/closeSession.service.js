import { HourlyRate } from '../models/hourlyRate.model.js';
import { PlayingSession } from '../models/playingSession.model.js';
import { Table } from '../models/table.model.js';

export const closeSessionService = async (sessionId) => {
  const session = await PlayingSession.findOne({ session_id: sessionId });
  if (!session) throw new Error(`Session ${sessionId} does not exist`);
  if (session.end_time !== null) throw new Error(`Session ${sessionId} is already closed`);

  const endTime = new Date();
  const diffMs = endTime - session.start_time;
  const totalMinutes = Math.ceil(diffMs / 60000);

  const hourlyRate = await HourlyRate.findById(session.hourly_rate_id);
  if (!hourlyRate) throw new Error('Hourly rate not found for this session');

  const pricePerMinute = hourlyRate.price_per_hour / 60;
  const rawCost = totalMinutes * pricePerMinute;
  const totalCost = Math.ceil(rawCost / 500) * 500;

  session.end_time = endTime;
  session.total_playing_time_minutes = totalMinutes;
  session.total_session_cost = totalCost;
  await session.save();

  const table = await Table.findById(session.table_id);
  if (table) {
    table.status = 'available';
    await table.save();
  }

  return session.populate(['table_id', 'hourly_rate_id']);
};
