import { Table } from "../models/table.model.js";

export const getTableByIdService = async (tableId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const existingTable = await Table.findOne({ table_id: tableId });
    if (!existingTable) {
      throw new Error(`Table ${tableId} does not exist`);
    }
    return existingTable;
  } catch (error) {
    throw error;
  }
};
