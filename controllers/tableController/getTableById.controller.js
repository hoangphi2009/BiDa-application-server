import { getTableByIdService } from '../../services/getTableById.service.js';

export const getTableById = async (req, res) => {
  try {
    const { tableId } = req.params;
    const table = await getTableByIdService(tableId);
    if (table === `Table ${tableId} does not exist`) {
      return res.status(404).json({
        message: table,
        success: false,
      });
    }
    return res.status(200).json({
      message: `Table ${tableId} found`,
      data: table,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal server error`,
      error: error.message,
    });
  }
};
