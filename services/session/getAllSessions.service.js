import { PlayingSession } from '../../models/playingSession.model.js';
import { Table } from '../../models/table.model.js';

export const getAllSessionsService = async ({ tableId, date, status } = {}) => {
  const filter = {};

  if (tableId) {
    const table = await Table.findOne({ table_id: tableId });
    if (!table) throw new Error(`Table ${tableId} does not exist`);
    filter.table_id = table._id;
  }

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.start_time = { $gte: start, $lte: end };
  }

  if (status === 'open') filter.end_time = null;
  if (status === 'closed') filter.end_time = { $ne: null };

  const sessions = await PlayingSession.find(filter)
    .populate('table_id')
    .populate('hourly_rate_id')
    .sort({ start_time: -1 });

  return sessions;
};
