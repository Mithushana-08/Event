import React from 'react';
import './AddEventForm.css';

const AddEventForm = ({ onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2 className="modal-title">Add New Event</h2>
      <div className="form-grid">
        <div>
          <label className="form-label">Event Name</label>
          <input className="form-input" type="text" placeholder="Enter event name" />
        </div>
        <div>
          <label className="form-label">Venue</label>
          <input className="form-input" type="text" placeholder="Enter venue location" />
        </div>
        <div>
          <label className="form-label">Date</label>
          <input className="form-input" type="date" placeholder="mm/dd/yyyy" />
        </div>
        <div>
          <label className="form-label">Time</label>
          <input className="form-input" type="time" />
        </div>
        <div>
          <label className="form-label">Total Seats</label>
          <input className="form-input" type="number" defaultValue="0" />
        </div>
        <div>
          <label className="form-label">Price per Ticket ($)</label>
          <input className="form-input" type="number" defaultValue="0" />
        </div>
        <div className="full-width">
          <label className="form-label">Description</label>
          <textarea className="form-input" placeholder="Enter event description"></textarea>
        </div>
      </div>
      <div className="modal-actions">
        <button className="modal-button primary" onClick={onClose}>Create Event</button>
        <button className="modal-button secondary" onClick={onClose}>Cancel</button>
      </div>
    </div>
  </div>
);

export default AddEventForm;