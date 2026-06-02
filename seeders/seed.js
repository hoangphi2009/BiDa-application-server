import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedTable } from './seeds/seedTable.js';
import { seedOtherItem } from './seeds/seedOtherItem.js';
import { seedHourlyRate } from './seeds/seedHourlyRate.js';
dotenv.config();

async function main () {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connect with mongoDB successfully');
    await seedHourlyRate();
    await seedTable();
    await seedOtherItem();

    console.log('Seeded all data successfully!');
    process.exit(0);
  } catch (err) {
    console.error('error seed:', err);
    process.exit(1);
  }
}

main();
