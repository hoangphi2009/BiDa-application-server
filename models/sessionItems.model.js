import mongoose from 'mongoose';

const { Schema } = mongoose;
const sessionItemsSchema = new mongoose.Schema({
  session_id: {
    type: Schema.Types.ObjectId,
    ref: 'PlayingSession',
    required: true
  },
  session_item_id: {
    type: String,
    required: true
  },
  item_id: {
    type: Schema.Types.ObjectId,
    ref: 'OtherItem',
    required: true
  },
  item_total_cost: { type: Number },
  total_items: { type: Number },
}, { timestamps: true })

export const SessionItems = mongoose.model('SessionItems', sessionItemsSchema)
