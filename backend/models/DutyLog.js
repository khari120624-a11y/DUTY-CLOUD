const mongoose = require('mongoose');

const dutyLogSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  targetDate: { type: String, required: true }, // Format YYYY-MM-DD
  shift: { type: String, required: true, default: 'General' },
  status: {
    type: String,
    enum: ['Present', 'Week Off', 'OT', 'WEEK OFF OT'],
    required: true
  },
  location: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('DutyLog', dutyLogSchema);
