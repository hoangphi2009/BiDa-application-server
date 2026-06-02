import { getItemByIdService } from '../../services/item/getItemById.service.js';

export const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await getItemByIdService(itemId);
    return res.status(200).json({ message: `Item ${itemId} found`, data: item });
  } catch (error) {
    if (error.message.includes('does not exist')) return res.status(404).json({ message: error.message });
    return res.status(500).json({ message: 'Internal server error' });
  }
};
