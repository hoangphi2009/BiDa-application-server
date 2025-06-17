import { Table } from '../models/table.model.js';

export const createTableServiceService = async (tableData) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { tableId, tableName, tableNumber, isAvailable } = tableData;
    if (!tableId || !tableName) {
      throw new Error('Table ID and Table Name are required');
    }

    const existingTable = await Table.findOne({ table_id: tableId });
    if (existingTable) {
      throw new Error(`Table with ID ${tableId} already exists`);
    }

    const newTable = new Table({
      table_id: tableId,
      table_name: tableName,
      table_number: tableNumber,
      is_available: isAvailable,
    });

    await newTable.save();
    return newTable;
  } catch (error) {
    throw error;
  }
};
