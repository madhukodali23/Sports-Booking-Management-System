const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EquipmentSchema = new Schema({
  name: String,
  totalStock: { type: Number, default: 0 },
  pricePerUnit: { type: Number, default: 0 }
});
module.exports = mongoose.model('Equipment', EquipmentSchema);
