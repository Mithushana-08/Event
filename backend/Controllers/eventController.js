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
  try {
    const { title, description, date, time, venue, totalSeats, availableSeats } = req.body;
    const image = req.file ? req.file.filename : null;
    // Convert date to YYYY-MM-DD for MySQL DATE column
    const dateOnly = date ? new Date(date).toISOString().slice(0, 10) : null;

    const queryResult = await pool.query(
      'INSERT INTO events (title, description, date, time, venue, totalSeats, availableSeats, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, dateOnly, time, venue, totalSeats, availableSeats, image]
    );
    const result = Array.isArray(queryResult) ? queryResult[0] : queryResult;

    res.json({ message: 'Event created', event_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create event: ' + err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM events WHERE event_id = ?', [id]);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[${req.method}] ${req.originalUrl} | Update request for event_id:`, id); // Debug log
    if (!id) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // Fetch current event data
    const [rows] = await pool.query('SELECT * FROM events WHERE event_id = ?', [id]);
    console.log('Select result:', rows); // Debug log
    let current;
    if (Array.isArray(rows)) {
      if (!rows.length) {
        console.log('Event not found for update:', id);
        return res.status(404).json({ error: 'Event not found', event_id: id });
      }
      current = rows[0];
    } else if (rows && typeof rows === 'object') {
      current = rows;
    } else {
      console.log('Event not found for update:', id);
      return res.status(404).json({ error: 'Event not found', event_id: id });
    }

    const {
      title = current.title,
      description = current.description,
      date = current.date,
      time = current.time,
      venue = current.venue,
      totalSeats = current.totalSeats,
      availableSeats = current.availableSeats
    } = req.body;

    let image = current.image; // Default to current image
    if (req.file) {
      image = req.file.filename;
    } else if (req.body.image) {
      image = req.body.image;
    }

    // Ensure date is in YYYY-MM-DD format
    const dateOnly = date ? new Date(date).toISOString().slice(0, 10) : current.date;

    // Update the event (removed status column)
    await pool.query(
      'UPDATE events SET title = ?, description = ?, date = ?, time = ?, venue = ?, totalSeats = ?, availableSeats = ?, image = ? WHERE event_id = ?',
      [title, description, dateOnly, time, venue, totalSeats, availableSeats, image, id]
    );

    // Fetch the updated event
    const [updated] = await pool.query('SELECT * FROM events WHERE event_id = ?', [id]);
    res.json(Array.isArray(updated) ? updated[0] : updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update event: ' + err.message });
  }
};