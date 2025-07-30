import { getOtherItemByIdService } from '../../services/otheritemServices/getOtherItemByIdService.service.js';

export const getOtherItemByIdController = async (req, res) => {
  try {
    const { itemId } = req.params;
    const existingOtherItem = await getOtherItemByIdService(itemId);
    if (
      existingOtherItem === `OtherItem with ID ${itemId} does not exist`
    ) {
      return res.status(404).json({
        message: existingOtherItem,
        success: false,
      });
    }
    return res.status(200).json({
      message: `OtherItem with ID ${itemId} found`,
      success: true,
      data: existingOtherItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
