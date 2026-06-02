import mongoose from 'mongoose';

const { Schema } = mongoose;

const tableSchema = new mongoose.Schema({
  table_id: {
    type: String,
    required: true,
    unique: true
  },
  table_name: {
    type: String,
    required: true
  },
  table_number: {
    type: Number,
    required: true
  },
  table_type: {
    type: String,
    default: 'standard'
  },
  status: {
    type: String,
    enum: ['available', 'playing', 'maintenance'],
    default: 'available'
  },
  hourly_rate_id: {
    type: Schema.Types.ObjectId,
    ref: 'HourlyRate',
    default: null
  }
}, { timestamps: true });

export const Table = mongoose.model('Table', tableSchema);
