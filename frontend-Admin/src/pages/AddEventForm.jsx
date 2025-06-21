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
    title: '',
    venue: '',
    date: '',
    time: '',
    totalSeats: 0,
    description: '',
    image: '',
    id: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setForm({
      title: initialData?.title || '',
      venue: initialData?.venue || '',
      date: initialData?.date || '',
      time: initialData?.time || '',
      totalSeats: initialData?.totalSeats || 0,
      description: initialData?.description || '',
      image: initialData?.image || '',
      id: initialData?.id || '',
    });
    setImageFile(null);
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImageChange = e => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id
        ? `http://localhost:5000/api/events/${form.id}`
        : 'http://localhost:5000/api/events';
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('venue', form.venue);
      formData.append('date', form.date);
      formData.append('time', form.time);
      formData.append('totalSeats', form.totalSeats);
      formData.append('description', form.description);
      formData.append('availableSeats', form.totalSeats);
      formData.append('status', 'Active');
      if (imageFile) formData.append('image', imageFile);
      if (form.id && form.image && !imageFile) formData.append('image', form.image);
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to save event');
      onEventAdded && onEventAdded();
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
              <input className="form-input" type="text" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <label className="form-label">Venue</label>
              <input className="form-input" type="text" name="venue" value={form.venue} onChange={handleChange} required />
            </div>
            <div>
              <label className="form-label">Date</label>
              <input className="form-input" type="date" name="date" value={formatDateForInput(form.date)} onChange={handleChange} required />
            </div>
            <div>
              <label className="form-label">Time</label>
              <input className="form-input" type="time" name="time" value={form.time} onChange={handleChange} required />
            </div>
            <div>
              <label className="form-label">Total Seats</label>
              <input className="form-input" type="number" name="totalSeats" value={form.totalSeats} onChange={handleChange} required />
            </div>
            <div className="full-width">
              <label className="form-label">Description</label>
              <textarea className="form-input" name="description" value={form.description} onChange={handleChange} required></textarea>
            </div>
            <div className="full-width">
              <label className="form-label">Event Image</label>
              <input className="form-input" type="file" accept="image/*" onChange={handleImageChange} />
              {form.image && !imageFile && (
                <img src={form.image} alt="event" style={{ width: 80, marginTop: 8, borderRadius: 4 }} />
              )}
              {imageFile && (
                <span style={{ color: '#3b82f6' }}>{imageFile.name}</span>
              )}
            </div>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="modal-actions">
            <button className="modal-button primary" type="submit" disabled={loading}>{initialData ? 'Update Event' : 'Create Event'}</button>
            <button className="modal-button secondary" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventForm;