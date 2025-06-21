const pool = require('../config/db');

exports.getBookings = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT b.*, e.title as eventTitle FROM bookings b JOIN events e ON b.event_id = e.event_id`
  );
  res.json(rows);
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { event_id, name, email, seats } = req.body;
    if (!event_id || !name || !email || !seats) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Insert booking
    const result = await pool.query(
      'INSERT INTO bookings (event_id, name, email, seats) VALUES (?, ?, ?, ?)',
      [event_id, name, email, seats]
    );
    // Optionally, decrement availableSeats in events table
    await pool.query(
      'UPDATE events SET availableSeats = availableSeats - ? WHERE event_id = ? AND availableSeats >= ?',
      [seats, event_id, seats]
    );
    res.status(201).json({ booking_id: result.insertId, event_id, name, email, seats });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};