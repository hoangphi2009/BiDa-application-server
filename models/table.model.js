import mongoose from 'mongoose';

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
  is_available: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const Table = mongoose.model('Table', tableSchema);
