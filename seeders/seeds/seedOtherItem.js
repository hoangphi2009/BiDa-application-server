import { OtherItem } from '../../models/otherItem.model.js';

export async function seedOtherItem () {
  const otherItem = [
    { item_id: 'NN01', item_name: 'Sting', price: 10000, category: 'drink' },
    { item_id: 'CF01', item_name: 'Cafe Đá', price: 10000, category: 'drink' },
    { item_id: 'CF02', item_name: 'Cafe Sữa', price: 15000, category: 'drink' },
    { item_id: 'NN02', item_name: 'Mì tôm', price: 15000, category: 'other' },
  ]
  await OtherItem.deleteMany();
  await OtherItem.insertMany(otherItem);
  console.log('seeded data other items successfully');
}
