import mongoose from 'mongoose'

const otherItemSchema = new mongoose.Schema({
  item_id: {
    type: String,
    required: true,
    unique: true
  },
  item_name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['drink', 'other']
  }
}, { timestamps: true })

export const OtherItem = mongoose.model('OtherItem', otherItemSchema);
