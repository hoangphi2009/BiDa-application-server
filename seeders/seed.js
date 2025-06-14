import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedTable } from './seeds/seedTable.js';
import { seedOtherItem } from './seeds/seedOtherItem.js';
dotenv.config();

async function main () {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connect with mongoDB successfully');
    await seedTable();
    await seedOtherItem();

    console.log('seeders!');
    process.exit(0);
  } catch (err) {
    console.error('error seed:', err);
    process.exit(1);
  }
}

main();
