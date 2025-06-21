const pool = require('../config/db');

exports.getBookings = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT b.*, e.title as eventTitle FROM bookings b JOIN events e ON b.event_id = e.event_id`
  );
  res.json(rows);
};