const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BookingSchema = new Schema({
  userName: { type: String, required: true },
  court: { type: Schema.Types.ObjectId, ref: 'Court' },
  coach: { type: Schema.Types.ObjectId, ref: 'Coach', required: false },
  equipment: [{ equipment: { type: Schema.Types.ObjectId, ref: 'Equipment' }, qty: Number }],
  startTime: Date,
  endTime: Date,
  status: { type: String, enum: ['confirmed','cancelled'], default: 'confirmed' },
  pricingBreakdown: Object,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Booking', BookingSchema);
