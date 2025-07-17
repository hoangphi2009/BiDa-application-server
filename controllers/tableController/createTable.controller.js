import { createTableService } from '../../services/createTableService.service.js';

export const createTable = async (req, res) => {
  try {
    const tableData = req.body;
    // eslint-disable-next-line new-cap
    const newTable = await createTableService(tableData);
    if (
      newTable === `Table ID, Table Name and Table Number are required` ||
      newTable === `Table with ID ${tableData.tableId} already exists`
    ) {
      return res.status(400).json({
        message: newTable,
        success: false,
      });
    }
    return res.status(200).json({
      message: `Successfully created table`,
      table: newTable,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal server error`,
    });
  }
};
