import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  tableName: {
    type: String,
    required: true
  },

  timeStart: {
    type: Date,
    required: true
  },

  timeEnd: {
    type: Date,
    required: true
  },
}, { timestamps: true });

export const Table = mongoose.model('Table', tableSchema);