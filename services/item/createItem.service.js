import { OtherItem } from '../../models/otherItem.model.js';

export const createItemService = async ({ item_id, item_name, price, category }) => {
  if (!item_id || !item_name || !price || !category) {
    throw new Error('item_id, item_name, price và category là bắt buộc');
  }
  const existing = await OtherItem.findOne({ item_id });
  if (existing) throw new Error(`Item với ID ${item_id} đã tồn tại`);

  const item = new OtherItem({ item_id, item_name, price, category });
  await item.save();
  return item;
};
