import { deleteTabelService } from '../../services/deleteTableService.service.js';

export const deletedTable = async (req, res) => {
  try {
    const { tableId } = req.params;
    console.log('tableId:', tableId);
    const result = await deleteTabelService(tableId);
    return res.status(200).json({
      message: `Successfully deleted table ${tableId} service`,
      result,
    });
  } catch (error) {
    const { tableId } = req.params;
    if (error.message === `Table ${tableId} does not exist`) {
      return res.status(400).json({
        message: error.message
      });
    }
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};
