import { Table } from '../models/table.model.js';

export const deleteTableService = async (tableId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const table = await Table.findOne({ table_id: tableId });
    console.log(table);
    if (!table) {
      throw new Error(`Table ${tableId} does not exist`);
    }
    await Table.deleteOne({ table_id: tableId });
    return { message: 'Deleted table' };
  } catch (error) {
    throw error;
  }
};
