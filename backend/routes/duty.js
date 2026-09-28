const express = require('express');
const router = express.Router();
const { getStaff } = require('./staff');

let dutyDB = [];

router.get('/', (req, res) => {
  const { targetDate, startDate, endDate } = req.query;
  let logs = [...dutyDB];
  
  if (targetDate) {
    logs = logs.filter(l => l.targetDate === targetDate);
  } else if (startDate && endDate) {
    logs = logs.filter(l => l.targetDate >= startDate && l.targetDate <= endDate);
  }
  
  // Sort descending by targetDate
  logs.sort((a, b) => b.targetDate.localeCompare(a.targetDate));
  res.json(logs);
});

router.post('/', (req, res) => {
  const staffList = getStaff();
  const staffObj = staffList.find(s => s._id === req.body.staff);
  
  if (!staffObj) return res.status(400).json({ error: 'Staff not found' });
  
  const newLog = {
    _id: Date.now().toString(),
    ...req.body,
    staff: staffObj
  };
  dutyDB.push(newLog);
  res.status(201).json(newLog);
});

router.delete('/:id', (req, res) => {
  dutyDB = dutyDB.filter(l => l._id !== req.params.id);
  res.json({ message: 'Duty log deleted' });
});

module.exports = router;
