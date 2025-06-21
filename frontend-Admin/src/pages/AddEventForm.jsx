import React, { useState, useEffect } from 'react';
import './AddEventForm.css';

// Helper to format date to yyyy-MM-dd
function formatDateForInput(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d)) return '';
  return d.toISOString().slice(0, 10);
}

const AddEventForm = ({ onClose, onEventAdded, initialData }) => {
  const [form, setForm] = useState({
    event_id: '',
    title: '',
    venue: '',
    date: '',
    time: '',
    totalSeats: '',
    availableSeats: '',
    description: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seatError, setSeatError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        event_id: initialData.event_id || '',
        title: initialData.title || '',
        venue: initialData.venue || '',
        date: initialData.date ? initialData.date.slice(0, 10) : '', // Only YYYY-MM-DD
        time: initialData.time || '',
        totalSeats: initialData.totalSeats || '',
        availableSeats: initialData.availableSeats || '',
        description: initialData.description || '',
        image: initialData.image || ''
      });
      setImageFile(null);
    } else {
      setForm({
        event_id: '',
        title: '',
        venue: '',
        date: '',
        time: '',
        totalSeats: '',
        availableSeats: '',
        description: '',
        image: ''
      });
      setImageFile(null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: value };
    // Convert to numbers for seat fields
    if (name === 'totalSeats' || name === 'availableSeats') {
      newForm[name] = Number(value);
    }
    // Validation: totalSeats >= availableSeats
    if (
      (name === 'totalSeats' && Number(value) < Number(form.availableSeats)) ||
      (name === 'availableSeats' && Number(form.totalSeats) < Number(value))
    ) {
      setSeatError('Total seats cannot be less than available seats.');
    } else {
      setSeatError('');
    }
    setForm(newForm);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const method = form.event_id ? 'PUT' : 'POST';
      const url = form.event_id
        ? `http://localhost:5000/api/events/${form.event_id}`
        : 'http://localhost:5000/api/events';

      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('venue', form.venue);
      formData.append('date', form.date);
      formData.append('time', form.time);
      formData.append('totalSeats', form.totalSeats);
      formData.append('availableSeats', form.availableSeats);
      formData.append('description', form.description);
      if (imageFile) formData.append('image', imageFile);
      if (form.event_id && form.image && !imageFile) formData.append('image', form.image);

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: 'Bearer ' + (localStorage.getItem('token') || ''),
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save event');
      }

      const updatedEvent = await res.json();
      onEventAdded(updatedEvent);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{initialData ? 'Edit Event' : 'Add New Event'}</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-grid">
            <div>
              <label className="form-label">Event Name</label>
              <input
                className="form-input"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Venue</label>
              <input
                className="form-input"
                type="text"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                name="date"
                value={formatDateForInput(form.date)}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Time</label>
              <input
                className="form-input"
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Total Seats</label>
              <input
                className="form-input"
                type="number"
                name="totalSeats"
                value={form.totalSeats}
                min={form.availableSeats}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Available Seats</label>
              <input
                className="form-input"
                type="number"
                name="availableSeats"
                value={form.availableSeats}
                max={form.totalSeats}
                onChange={handleChange}
                required
              />
            </div>
            <div className="full-width">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="full-width">
              <label className="form-label">Event Image</label>
              <input
                className="form-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {form.image && !imageFile && (
                <img
                  src={form.image}
                  alt="event"
                  style={{ width: 80, marginTop: 8, borderRadius: 4 }}
                />
              )}
              {imageFile && (
                <span style={{ color: '#3b82f6' }}>{imageFile.name}</span>
              )}
            </div>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {seatError && <p style={{ color: 'red', gridColumn: 'span 2' }}>{seatError}</p>}
          <div className="modal-actions">
            <button
              className="modal-button primary"
              type="submit"
              disabled={loading || !!seatError}
            >
              {initialData ? 'Update Event' : 'Create Event'}
            </button>
            <button
              className="modal-button secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventForm;