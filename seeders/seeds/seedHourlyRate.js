import { HourlyRate } from '../../models/hourlyRate.model.js';

export async function seedHourlyRate () {
  const rates = [
    {
      hourly_rate_id: 'HR001',
      rate_id: 'HR001',
      rate_name: 'Bàn thường',
      price_per_hour: 20000,
      price_per_minute: 20000 / 60
    },
    {
      hourly_rate_id: 'HR002',
      rate_id: 'HR002',
      rate_name: 'Bàn VIP',
      price_per_hour: 25000,
      price_per_minute: 25000 / 60
    }
  ];
  await HourlyRate.deleteMany();
  await HourlyRate.insertMany(rates);
  console.log('seeded data HourlyRate successfully');
}
