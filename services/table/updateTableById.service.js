import { getTableByIdService } from './getTableById.service.js';

export const updateTableByIdService = async (tableIdParam, tableData) => {
  try {
    const tableById = await getTableByIdService(tableIdParam);
    if (!tableById) return `Can not update table with id ${tableIdParam} due to table not found`;

    const updatableFields = ['table_name', 'table_number', 'table_type', 'status', 'hourly_rate_id'];
    let hasChanges = false;

    for (const field of updatableFields) {
      if (tableData[field] !== undefined && String(tableById[field]) !== String(tableData[field])) {
        tableById[field] = tableData[field];
        hasChanges = true;
      }
    }

    if (!hasChanges) return `No changes to update`;

    await tableById.save();
    return tableById;
  } catch (error) {
    throw error;
  }
};
