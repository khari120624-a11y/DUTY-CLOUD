const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Login Route
router.post('/login', async (req, res) => {
  const { pin } = req.body;
  
  try {
    // For this SaaS portal, we just check against a simple PIN-based auth
    // In production, we'd look up the user by some ID + PIN
    // Here we find the first user with this PIN (or seed if not exists)
    let user = await User.findOne();
    
    // Seed initial manager if database is empty
    if (!user && pin === '2270') {
      const salt = await bcrypt.genSalt(10);
      const hashedPin = await bcrypt.hash('2270', salt);
      user = await User.create({ name: 'Security Manager', pin: hashedPin, role: 'Manager' });
    }

    if (!user) return res.status(400).json({ error: 'Invalid PIN.' });

    const validPin = await bcrypt.compare(pin, user.pin);
    if (!validPin && pin !== '2270') { 
      // Hardcoded fallback for demo '2270'
      return res.status(400).json({ error: 'Invalid PIN.' });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role, name: user.name },
      'supersecret_jwt_key_here',
      { expiresIn: '12h' }
    );
    
    res.json({ token, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
