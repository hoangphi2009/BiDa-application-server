import { HourlyRate } from '../../models/hourlyRate.model.js';
import { PlayingSession } from '../../models/playingSession.model.js';
import { Table } from '../../models/table.model.js';
import { calcPlayingMinutes, calcSessionCost } from '../../calculations/billing.calculation.js';

export const closeSessionService = async (sessionId) => {
  const session = await PlayingSession.findOne({ session_id: sessionId });
  if (!session) throw new Error(`Session ${sessionId} does not exist`);
  if (session.end_time !== null) throw new Error(`Session ${sessionId} is already closed`);

  const hourlyRate = await HourlyRate.findById(session.hourly_rate_id);
  if (!hourlyRate) throw new Error('Hourly rate not found for this session');

  const endTime = new Date();
  const totalMinutes = calcPlayingMinutes(session.start_time, endTime);
  const totalCost = calcSessionCost(totalMinutes, hourlyRate.price_per_hour);

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
