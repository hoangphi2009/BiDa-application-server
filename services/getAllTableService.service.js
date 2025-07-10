import { Table } from '../models/table.model.js';

export const getAllTableService = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const tables = await Table.find();
    return tables;
  } catch (error) {
    throw error;
  }
};
