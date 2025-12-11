const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CourtSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['indoor','outdoor'], default: 'indoor' },
  basePrice: { type: Number, default: 100 } // base price per hour in currency units
});
module.exports = mongoose.model('Court', CourtSchema);
