import { getItemByIdService } from './getItemById.service.js';

export const updateItemService = async (itemId, data) => {
  const item = await getItemByIdService(itemId);

  const updatableFields = ['item_name', 'price', 'category'];
  let hasChanges = false;

  for (const field of updatableFields) {
    if (data[field] !== undefined && String(item[field]) !== String(data[field])) {
      item[field] = data[field];
      hasChanges = true;
    }
  }

  if (!hasChanges) throw new Error('No changes to update');

  await item.save();
  return item;
};
