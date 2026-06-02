import { Table } from '../../models/table.model.js';

export async function seedTable () {
  const tables = [
    { table_id: 'T001', table_name: 'Table01', table_number: 1, table_type: 'standard', status: 'available' },
    { table_id: 'T002', table_name: 'Table02', table_number: 2, table_type: 'vip', status: 'available' },
  ];
  await Table.deleteMany();
  await Table.insertMany(tables);
  console.log('seeded data Table successfully');
}
