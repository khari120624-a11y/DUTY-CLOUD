const express = require('express');
const cors = require('cors');
const path = require('path');

const staffRoutes = require('./routes/staff').router;
const dutyRoutes = require('./routes/duty');
const locationRoutes = require('./routes/locations');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/staff', staffRoutes);
app.use('/api/duty', dutyRoutes);
app.use('/api/locations', locationRoutes);

// Serve Static Frontend (Production Deployment)
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Security SaaS Backend (No-DB Version) running on port ${PORT}`);
});
