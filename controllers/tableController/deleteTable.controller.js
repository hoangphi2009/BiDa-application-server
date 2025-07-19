import { deleteTableService } from '../../services/tableServices/deleteTableService.service.js';

export const deletedTable = async (req, res) => {
  try {
    const { tableId } = req.params;
    const result = await deleteTableService(tableId);
    if (result === `Table ${tableId} does not exist`) {
      return res.status(400).json({
        message: result,
        success: false,
      });
    }
    return res.status(200).json({
      message: `Successfully deleted table ${tableId} service`,
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};
