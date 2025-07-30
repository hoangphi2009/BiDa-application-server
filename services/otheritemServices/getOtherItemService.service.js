import { OtherItem } from '../../models/otherItem.model.js';

export const getAllOtherItemService = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const otherItems = await OtherItem.find();
    return otherItems;
  } catch (error) {
    throw error;
  }
};
