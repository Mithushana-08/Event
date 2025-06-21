const express = require('express');
const cors = require('cors');
const app = express();
const adminRoutes = require('./routes/admin');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/booking');
const path = require('path');
const pool = require('./config/db');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

pool.query('SELECT 1', (err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  } else {
    console.log('database connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  }
});