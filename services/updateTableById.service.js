import { getTableByIdService } from "./getTableById.service.js";

export const updateTableByIdService = async (tableIdParam, tableData) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const tableById = await getTableByIdService(tableIdParam);
    if (!tableById) return `Cannot update table with id ${tableIdParam} because it was not found`;
    if (
      (tableData.table_name && tableById.table_name === tableData.table_name) &&
      (tableData.table_number && tableById.table_number === tableData.table_number) &&
      (tableData.is_available && tableById.is_available === tableData.is_available)
    ) {
      return `No changes to update`;
    }
    if (tableData.table_name && tableById.table_name !== tableData.table_name) tableById.table_name = tableData.table_name;
    if (tableData.table_number && tableById.table_number !== tableData.table_number) tableById.table_number = tableData.table_number;
    if (tableData.is_available && tableById.is_available !== tableData.is_available) tableById.is_available = tableData.is_available;
    await tableById.save();
    return tableById;
  } catch (error) {
    throw error;
  }
};
