const express = require('express');
const router = express.Router();

// In-memory locations
let locationsDB = [
  { _id: 'L1', name: 'Main Gate', shift: 'General' },
  { _id: 'L2', name: 'Tower A', shift: 'Shift A' },
  { _id: 'L3', name: 'Tower B', shift: 'Shift B' },
  { _id: 'L4', name: 'Control Room', shift: 'Shift C' }
];

router.get('/', (req, res) => {
  res.json(locationsDB);
});

router.post('/', (req, res) => {
  const newLoc = { _id: Date.now().toString(), name: req.body.name, shift: req.body.shift };
  locationsDB.push(newLoc);
  res.status(201).json(newLoc);
});

router.delete('/:id', (req, res) => {
  locationsDB = locationsDB.filter(l => l._id !== req.params.id);
  res.json({ message: 'Location deleted' });
});

module.exports = router;
