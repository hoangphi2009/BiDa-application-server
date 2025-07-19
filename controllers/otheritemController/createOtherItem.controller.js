import { createOtherItemService } from '../../services/otheritemServices/createOtherItemService.service.js';

export const createOtherItem = async (req, res) => {
  try {
    const OtherItemData = req.body;
    const newOtherItem = await createOtherItemService(OtherItemData);
    if (newOtherItem === 'Item ID, Item Name, Price and Category are required') {
      return res.status(400).json({
        message: newOtherItem,
        success: false,
      });
    }
    if (newOtherItem === `OtherItem with ID ${OtherItemData.item_id} already exists`) {
      return res.status(400).json({
        message: newOtherItem,
        success: false,
      });
    }
    if (newOtherItem === 'Category must be one of: drink, other') {
      return res.status(400).json({
        message: newOtherItem,
        success: false,
      });
    }
    return res.status(200).json({
      message: 'Successfully created other item',
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
