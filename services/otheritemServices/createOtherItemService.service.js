import { OtherItem } from '../../models/otherItem.model.js';

export const createOtherItemService = async (otherItemData) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const {
      item_id: itemId,
      item_name: itemName,
      price: itemPrice,
      category: itemCategory,
    } = otherItemData;
    let checkUndefined = false;
    Object.values(otherItemData).forEach(e => !e && (checkUndefined = true));
    if (checkUndefined) {
      return 'Item ID, Item Name, Price and Category are required';
    }
    const existingOtherItem = await OtherItem.findOne({ item_id: itemId });
    if (existingOtherItem) {
      return `OtherItem with ID ${itemId} already exists`;
    }
    const categoryEnum = OtherItem.schema.path('category').enumValues;
    let validCategory = false;
    categoryEnum.forEach(e => e === itemCategory && (validCategory = true));
    if (!validCategory) {
      return 'Category must be one of: drink, other';
    }
    const newOtherItem = new OtherItem({
      item_id: itemId,
      item_name: itemName,
      price: itemPrice,
      category: itemCategory,
    });
    await newOtherItem.save();
    return newOtherItem;
  } catch (error) {
    throw error;
  }
};
