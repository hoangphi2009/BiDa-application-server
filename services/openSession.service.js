import { v4 as uuidv4 } from 'uuid';
import { Table } from '../models/table.model.js';
import { PlayingSession } from '../models/playingSession.model.js';

export const openSessionService = async ({ table_id }) => {
  const table = await Table.findOne({ table_id });
  if (!table) throw new Error(`Table ${table_id} does not exist`);
  if (table.status !== 'available') throw new Error(`Table ${table_id} is not available (current status: ${table.status})`);
  if (!table.hourly_rate_id) throw new Error(`Table ${table_id} has no hourly rate assigned`);

  const session = new PlayingSession({
    session_id: uuidv4(),
    table_id: table._id,
    hourly_rate_id: table.hourly_rate_id,
    start_time: new Date(),
    end_time: null
  });

  await session.save();

  table.status = 'playing';
  await table.save();

  return session.populate(['table_id', 'hourly_rate_id']);
};
