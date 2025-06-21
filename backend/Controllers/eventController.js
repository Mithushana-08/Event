const pool = require('../config/db');
const path = require('path');

exports.getEvents = async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM events');
    // Add image URL if image exists
    const events = rows.map(event => ({
      ...event,
      image: event.image ? `${req.protocol}://${req.get('host')}/uploads/${event.image}` : null
    }));
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createEvent = async (req, res) => {
  const { title, description, date, time, venue, totalSeats, availableSeats } = req.body;
  const image = req.file ? req.file.filename : null;
  await pool.query(
    'INSERT INTO events (title, description, date, time, venue, totalSeats, availableSeats, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [title, description, date, time, venue, totalSeats, availableSeats, image]
  );
  res.json({ message: 'Event created' });
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM events WHERE id = ?', [id]);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, venue, totalSeats, availableSeats, status } = req.body;
    let image = req.body.image;
    if (req.file) {
      image = req.file.filename;
    }
    await pool.query(
      'UPDATE events SET title=?, description=?, date=?, time=?, venue=?, totalSeats=?, availableSeats=?, status=?, image=? WHERE id=?',
      [title, description, date, time, venue, totalSeats, availableSeats, status, image, id]
    );
    res.json({ message: 'Event updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};