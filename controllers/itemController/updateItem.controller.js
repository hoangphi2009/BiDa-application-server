import { updateItemService } from '../../services/updateItem.service.js';

export const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await updateItemService(itemId, req.body);
    return res.status(200).json({ message: `Item ${itemId} updated successfully`, data: item });
  } catch (error) {
    if (error.message.includes('does not exist')) return res.status(404).json({ message: error.message });
    if (error.message.includes('No changes')) return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: 'Internal server error' });
  }
};
