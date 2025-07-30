import { OtherItem } from '../../models/otherItem.model.js';

export const getOtherItemByIdService = async (itemId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const existingItem = await OtherItem.findOne({ item_id: itemId });
    if (!existingItem) {
      return `OtherItem with ID ${itemId} does not exist`;
    }
    return existingItem;
  } catch (error) {
    throw error;
  }
};
