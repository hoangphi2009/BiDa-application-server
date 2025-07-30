import { getAllOtherItemService } from '../../services/otheritemServices/getOtherItemService.service.js';

export const getOtherItemController = async (req, res) => {
  try {
    const otherItems = await getAllOtherItemService();
    return res.status(200).json({
      message: 'List of all other items exist in the database',
      success: true,
      data: otherItems,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
