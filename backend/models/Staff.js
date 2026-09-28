const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  category: {
    type: String,
    enum: ['Ex-Army', 'Civil Male', 'Civil Female'],
    required: true
  },
  defaultWeekOff: {
    type: String,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
