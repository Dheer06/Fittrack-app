const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String }
});

module.exports = mongoose.model('Activity', ActivitySchema);
