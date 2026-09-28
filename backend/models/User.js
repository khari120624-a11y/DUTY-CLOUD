const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pin: { type: String, required: true }, // securely hashed
  role: { 
    type: String, 
    enum: ['SuperAdmin', 'Manager', 'Staff'],
    default: 'Manager' 
  }
});

module.exports = mongoose.model('User', userSchema);
