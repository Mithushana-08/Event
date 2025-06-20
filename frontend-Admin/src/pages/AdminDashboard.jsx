import React, { useState } from 'react';
import './AdminDashboard.css';
import AddEventForm from './AddEventForm';
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const initialEvents = [
  {
    id: 1,
    title: 'Kandy Esala Perahera',
    description: 'A grand cultural procession in Kandy, Sri Lanka.',
    date: '2024-08-10',
    time: '19:00',
    venue: 'Kandy City Center, Kandy',
    totalSeats: 2000,
    availableSeats: 1500,
    status: 'Active',
  },
  {
    id: 2,
    title: 'Colombo International Book Fair',
    description: 'The largest annual book fair in Sri Lanka.',
    date: '2024-09-15',
    time: '10:00',
    venue: 'BMICH, Colombo',
    totalSeats: 5000,
    availableSeats: 5000,
    status: 'Active',
  },
  {
    id: 3,
    title: 'Galle Literary Festival',
    description: 'Celebrating literature and arts in Galle.',
    date: '2024-10-20',
    time: '09:00',
    venue: 'Galle Fort, Galle',
    totalSeats: 1200,
    availableSeats: 0,
    status: 'Sold Out',
  },
];

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
  const [events, setEvents] = useState(initialEvents);
  const [bookings] = useState(initialBookings);

  const handleDelete = (id) => {
    setEvents(events.filter(event => event.id !== id));
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
                    <FaEdit style={{ color: '#3b82f6', cursor: 'pointer', marginRight: 12 }} title="Edit" />
                    <FaTrash style={{ color: '#ef4444', cursor: 'pointer' }} title="Delete" onClick={() => handleDelete(event.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-event-button" onClick={() => setShowAddEvent(true)}>Add New Event</button>
          {showAddEvent && <AddEventForm onClose={() => setShowAddEvent(false)} />}
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