const express = require('express');
const router = express.Router();


// In-memory data store
let staffDB = [
  { _id: '1', staffId: 'S-101', fullName: 'John Doe', category: 'Ex-Army', defaultWeekOff: 'Sunday' },
  { _id: '2', staffId: 'S-102', fullName: 'Jane Smith', category: 'Civil Female', defaultWeekOff: 'Wednesday' }
];

router.get('/', (req, res) => {
  res.json(staffDB);
});

router.post('/', (req, res) => {
  const newStaff = { _id: Date.now().toString(), ...req.body };
  staffDB.push(newStaff);
  res.status(201).json(newStaff);
});

router.delete('/:id', (req, res) => {
  staffDB = staffDB.filter(s => s._id !== req.params.id);
  res.json({ message: 'Staff deleted' });
});

module.exports = { router, getStaff: () => staffDB };
