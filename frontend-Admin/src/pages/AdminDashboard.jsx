import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import AddEventForm from './AddEventForm';
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const initialBookings = [
  {
    eventId: 1,
    name: 'Nimal Perera',
    email: 'nimal@example.com',
    seats: 3,
  },
];

const AdminDashboard = () => {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [bookings] = useState(initialBookings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editEvent, setEditEvent] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') },
      });
      if (!res.ok) throw new Error('Failed to delete event');
      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (event) => {
    // Use local event data for editing, do not fetch from backend
    setEditEvent(event);
    setShowAddEvent(true);
  };

  const handleEventAdded = () => {
    fetchEvents();
    setEditEvent(null);
  };

  return (
    <div className="dashboard-container">
     
      <div className="dashboard-stats">
        <div className="stat-box blue-border">
          <p>Total Events</p>
          <p className="stat-value blue">0</p>
        </div>
        <div className="stat-box green-border">
          <p>Total Bookings</p>
          <p className="stat-value green">0</p>
        </div>
        <div className="stat-box purple-border">
          <p>Total Revenue</p>
          <p className="stat-value purple">$0</p>
        </div>
      </div>
      <div className="dashboard-tabs">
        <button className={`tab-button${activeTab === 'events' ? ' active' : ''}`} onClick={() => setActiveTab('events')}>Event Management</button>
        <button className={`tab-button${activeTab === 'bookings' ? ' active' : ''}`} onClick={() => setActiveTab('bookings')}>Booking Management</button>
      </div>
      {activeTab === 'events' && (
        <div className="dashboard-section">
          <h2 className="section-title">Events</h2>
          {loading ? (
            <p>Loading events...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <table className="events-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Venue</th>
                  <th>Total Seats</th>
                  <th>Available Seats</th>
                  <th>Status</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.description}</td>
                    <td>{event.date}</td>
                    <td>{event.time}</td>
                    <td>{event.venue}</td>
                    <td>{event.totalSeats}</td>
                    <td>{event.availableSeats}</td>
                    <td>
                      {event.status === 'Active' ? (
                        <FaCheckCircle style={{ color: '#22c55e' }} title="Active" />
                      ) : (
                        <FaTimesCircle style={{ color: '#ef4444' }} title="Sold Out" />
                      )}
                    </td>
                    <td>
                      {event.image ? (
                        <img src={event.image} alt="event" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                      ) : (
                        <span style={{ color: '#aaa' }}>No image</span>
                      )}
                    </td>
                    <td>
                      <FaEdit style={{ color: '#3b82f6', cursor: 'pointer', marginRight: 12 }} title="Edit" onClick={() => handleEdit(event)} />
                      <FaTrash style={{ color: '#ef4444', cursor: 'pointer' }} title="Delete" onClick={() => handleDelete(event.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button className="add-event-button" onClick={() => { setShowAddEvent(true); setEditEvent(null); }}>Add New Event</button>
          {showAddEvent && (
            <AddEventForm onClose={() => { setShowAddEvent(false); setEditEvent(null); }} onEventAdded={handleEventAdded} initialData={editEvent} />
          )}
        </div>
      )}
      {activeTab === 'bookings' && (
        <div className="dashboard-section">
          <h2 className="section-title">Bookings</h2>
          <table className="events-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Name</th>
                <th>Email</th>
                <th>Seats</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, idx) => (
                <tr key={idx}>
                  <td>{initialEvents.find(e => e.id === booking.eventId)?.title || 'Unknown Event'}</td>
                  <td>{booking.name}</td>
                  <td>{booking.email}</td>
                  <td>{booking.seats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;