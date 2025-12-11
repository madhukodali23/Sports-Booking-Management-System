const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CoachSchema = new Schema({
  name: String,
  hourlyRate: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true }
});
module.exports = mongoose.model('Coach', CoachSchema);
