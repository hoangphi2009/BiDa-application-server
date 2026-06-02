import { OtherItem } from '../../models/otherItem.model.js';

export const getAllItemsService = async ({ category } = {}) => {
  const filter = {};
  if (category) filter.category = category;
  return OtherItem.find(filter).sort({ category: 1, item_name: 1 });
};
