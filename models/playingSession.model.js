import mongoose from 'mongoose';

const { Schema } = mongoose;

const playingSessionSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
    unique: true
  },
  table_id: {
    type: Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  hourly_rate_id: {
    type: Schema.Types.ObjectId,
    ref: 'HourlyRate',
    required: true
  },
  start_time: {
    type: Date,
    default: Date.now,
    required: true
  },
  end_time: {
    type: Date,
    default: null
  },
  total_playing_time_minutes: {
    type: Number,
    default: null
  },
  total_session_cost: {
    type: Number,
    default: null
  }
}, { timestamps: true });

export const PlayingSession = mongoose.model('PlayingSession', playingSessionSchema);
