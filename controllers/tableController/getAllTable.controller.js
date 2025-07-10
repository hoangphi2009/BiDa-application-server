import { getAllTableService } from '../../services/getAllTableService.service.js';

export const getAllTables = async (req, res) => {
  try {
    const tables = await getAllTableService();
    return res.status(200).json({
      message: 'List of all tables exist in the database',
      data: tables,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
