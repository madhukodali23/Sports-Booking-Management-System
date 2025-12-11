const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PricingRuleSchema = new Schema({
  name: String,
  type: String, // 'weekend' | 'peak' | 'holiday' | 'premium'
  startHour: Number, // optional
  endHour: Number,   // optional
  multiplier: { type: Number, default: 1 }, // multiply price
  surcharge: { type: Number, default: 0 },   // add fixed amount
  days: [Number], // 0-6 for Sun-Sat (optional)
  active: { type: Boolean, default: true }
});
module.exports = mongoose.model('PricingRule', PricingRuleSchema);
