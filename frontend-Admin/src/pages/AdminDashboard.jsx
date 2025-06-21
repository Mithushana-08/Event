import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import AddEventForm from './AddEventForm';
import { FaEdit, FaTrash } from 'react-icons/fa';

const initialBookings = [
  {
    event_id: 1,
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
      const response = await fetch('http://localhost:5000/api/events', {
        headers: {
          Authorization: 'Bearer ' + (localStorage.getItem('token') || ''),
        },
      });
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

  const handleDelete = async (event_id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/events/${event_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + (localStorage.getItem('token') || ''),
        },
      });
      if (!res.ok) throw new Error('Failed to delete event');
      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (event) => {
    setEditEvent({
      event_id: event.event_id,
      title: event.title,
      venue: event.venue,
      date: event.date,
      time: event.time,
      totalSeats: event.totalSeats,
      availableSeats: event.availableSeats,
      description: event.description,
      image: event.image,
      status: event.status,
    });
    setShowAddEvent(true);
  };

  const handleEventAdded = (updatedEvent) => {
    fetchEvents();
    setEditEvent(null);
    setShowAddEvent(false);
  };

  return (
    <div>
      <nav className="admin-navbar">
        <span className="admin-navbar-title">Admin Panel</span>
        <button
          className="admin-logout-button"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}
        >
          Logout
        </button>
      </nav>
      <div className="dashboard-container">
        <div className="dashboard-stats">
          <div className="stat-box blue-border">
            <p>Total Events</p>
            <p className="stat-value blue">{events.length}</p>
          </div>
          <div className="stat-box green-border">
            <p>Total Bookings</p>
            <p className="stat-value green">{bookings.length}</p>
          </div>
        </div>
        <div className="dashboard-tabs">
          <button
            className={`tab-button${activeTab === 'events' ? ' active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Event Management
          </button>
          <button
            className={`tab-button${activeTab === 'bookings' ? ' active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Booking Management
          </button>
        </div>
        {activeTab === 'events' && (
          <div className="dashboard-section">
            <h2 className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Events</span>
              <button
                className="add-event-button"
                style={{ marginBottom: 0 }}
                onClick={() => {
                  setShowAddEvent(true);
                  setEditEvent(null);
                }}
              >
                Add New Event
              </button>
            </h2>
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
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.event_id}>
                      <td>{event.title}</td>
                      <td>{event.description}</td>
                      <td>{event.date ? event.date.slice(0, 10) : ''}</td>
                      <td>{event.time}</td>
                      <td>{event.venue}</td>
                      <td>{event.totalSeats}</td>
                      <td>{event.availableSeats}</td>
                      <td>
                        {event.image ? (
                          <img
                            src={event.image}
                            alt="event"
                            style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }}
                          />
                        ) : (
                          <span style={{ color: '#aaa' }}>No image</span>
                        )}
                      </td>
                      <td>
                        <FaEdit
                          style={{ color: '#3b82f6', cursor: 'pointer', marginRight: 12 }}
                          title="Edit"
                          onClick={() => handleEdit(event)}
                        />
                        <FaTrash
                          style={{ color: '#ef4444', cursor: 'pointer' }}
                          title="Delete"
                          onClick={() => handleDelete(event.event_id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {showAddEvent && (
              <AddEventForm
                onClose={() => {
                  setShowAddEvent(false);
                  setEditEvent(null);
                }}
                onEventAdded={handleEventAdded}
                initialData={editEvent}
              />
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
                    <td>
                      {events.find((e) => e.event_id === booking.event_id)?.title || 'Unknown Event'}
                    </td>
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
    </div>
  );
};

export default AdminDashboard;