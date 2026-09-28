const express = require('express');
const router = express.Router();

// In-memory shifts
let shiftsDB = [
  { _id: 'S1', name: 'General' },
  { _id: 'S2', name: 'Shift A' },
  { _id: 'S3', name: 'Shift B' },
  { _id: 'S4', name: 'Shift C' }
];

router.get('/', (req, res) => {
  res.json(shiftsDB);
});

router.post('/', (req, res) => {
  const newLoc = { _id: Date.now().toString(), name: req.body.name };
  shiftsDB.push(newLoc);
  res.status(201).json(newLoc);
});

router.delete('/:id', (req, res) => {
  shiftsDB = shiftsDB.filter(l => l._id !== req.params.id);
  res.json({ message: 'Shift deleted' });
});

module.exports = router;
