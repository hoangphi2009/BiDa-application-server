import { deleteItemService } from '../../services/deleteItem.service.js';

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    await deleteItemService(itemId);
    return res.status(200).json({ message: `Item ${itemId} deleted successfully` });
  } catch (error) {
    if (error.message.includes('does not exist')) return res.status(404).json({ message: error.message });
    return res.status(500).json({ message: 'Internal server error' });
  }
};
