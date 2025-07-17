import { Table } from '../models/table.model.js';

export const createTableService = async (tableData) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { table_id: tableId, table_name: tableName, table_number: tableNumber, is_available: isAvailable } = tableData;
    if (!tableId || !tableName || !tableNumber) {
      return `Table ID, Table Name and Table Number are required`;
    }

    const existingTable = await Table.findOne({ table_id: tableId });
    if (existingTable) {
      return `Table with ID ${tableId} already exists`;
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
