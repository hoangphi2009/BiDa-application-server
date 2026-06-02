import { OtherItem } from '../../models/otherItem.model.js';

export const deleteItemService = async (itemId) => {
  const item = await OtherItem.findOne({ item_id: itemId });
  if (!item) throw new Error(`Item ${itemId} does not exist`);
  await OtherItem.deleteOne({ item_id: itemId });
};
