import { Table } from '../../models/table.model.js';

export async function seedTable () {
  const tables = [
    { table_id: 'T001', table_name: 'Table01', table_number: 1, is_available: false },
    { table_id: 'T002', table_name: 'Table02', table_number: 2, is_available: false },
  ];
  await Table.deleteMany();
  await Table.insertMany(tables);
  console.log('seeded data Table successfully');
}
