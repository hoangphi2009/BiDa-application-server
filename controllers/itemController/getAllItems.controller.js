import { getAllItemsService } from '../../services/item/getAllItems.service.js';

export const getAllItems = async (req, res) => {
  try {
    const { category } = req.query;
    const items = await getAllItemsService({ category });
    return res.status(200).json({ message: 'List of all items', data: items });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
