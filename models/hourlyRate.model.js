import mongoose from 'mongoose';

const hourlyRateSchema = new mongoose.Schema({
  hourly_rate_id: {
    type: String,
    required: true,
  },
  rate_id: {
    type: String,
    required: true,
    unique: true
  },
  rate_name: {
    type: String,
    required: true,
  },
  price_per_hour: {
    type: Number,
    required: true,
  },
  price_per_minute: {
    type: Number,
    required: true,
  },
  effective_start_time: { type: String },
  effective_end_time: { type: String }
}, { timestamps: true })
export const HourlyRate = mongoose.model('HourlyRate', hourlyRateSchema);
