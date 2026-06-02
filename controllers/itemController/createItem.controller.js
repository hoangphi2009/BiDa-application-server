import { createItemService } from '../../services/item/createItem.service.js';

export const createItem = async (req, res) => {
  try {
    const item = await createItemService(req.body);
    return res.status(201).json({ message: 'Item created successfully', data: item });
  } catch (error) {
    if (error.message.includes('đã tồn tại') || error.message.includes('bắt buộc')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};
