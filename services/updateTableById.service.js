import { Table } from "../models/table.model.js";
import { getTableByIdService } from "./getTableById.service.js";

export const updateTableByIdService = async (tableId, tableData) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const table = await getTableByIdService(tableId);
    if (!table) {
      throw new Error(
        `Can not update table with id ${tableId} due to table not found`
      );
    }
    const tableUpdated = await Table.findOneAndUpdate(
      { table_id: tableId },
      tableData,
      {
        new: true,
        runValidators: true,
      }
    );
    return tableUpdated;
  } catch (error) {
    throw error;
  }
};
