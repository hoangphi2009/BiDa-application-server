import mongoose from 'mongoose';

const { Schema } = mongoose;
const invoiceSchema = new Schema({
  invoice_id: {
    type: String,
    required: true
  },
  session_id: {
    type: Schema.Types.ObjectId,
    ref: 'PlayingSession',
    required: true
  },
  invoice_date: {
    type: Date,
    default: Date.now
  },
  playing_cost: { type: Number },
  items_cost: { type: Number },
  total_amount: { type: Number },
  payment_status: {
    type: String,
    default: 'Chưa thanh toán'
  },
  notes: { type: String }
}, { timestamps: true })

export const Invoices = mongoose.model('Invoices', invoiceSchema)
