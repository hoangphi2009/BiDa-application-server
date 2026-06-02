import { OtherItem } from '../../models/otherItem.model.js';

export const getItemByIdService = async (itemId) => {
  const item = await OtherItem.findOne({ item_id: itemId });
  if (!item) throw new Error(`Item ${itemId} does not exist`);
  return item;
};
