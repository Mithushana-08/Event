import React, { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  const [category, setCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', seats: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesCategory = category === 'All' || event.category === category;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookNow = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  // Helper to map backend event to frontend display format
  const mapEvent = (event) => ({
    id: event.event_id,
    name: event.title,
    price: event.price ? event.price : '',
    date: event.date && event.time ? `${event.date.slice(0, 10)} at ${event.time}` : event.date || '',
    location: event.venue,
    seats: event.availableSeats,
    category: event.category || '',
    image: event.image,
    description: event.description // <-- add this line
  });

  // Map backend events to frontend format for display
  const displayEvents = filteredEvents.map(mapEvent);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(formData.seats) > selectedEvent.seats) {
      alert('Cannot book more seats than available!');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: selectedEvent.id,
          name: formData.name,
          email: formData.email,
          seats: parseInt(formData.seats)
        })
      });
      if (!res.ok) throw new Error('Failed to save booking');
      setSuccessMessage(`Booking Successful!\nEvent: ${selectedEvent.name}\nName: ${formData.name}\nEmail: ${formData.email}\nSeats: ${formData.seats}\nDate: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}`);
      setShowForm(false);
      setFormData({ name: '', email: '', seats: '' });
      setTimeout(() => setSuccessMessage(''), 5000);
      // Optionally, refresh events to update available seats
      const updatedEvents = await fetch('http://localhost:5000/api/events').then(r => r.json());
      setEvents(updatedEvents);
    } catch (err) {
      alert('Booking failed: ' + err.message);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({ name: '', email: '', seats: '' });
  };

  // Helper to check if event is in the past
  const isPastEvent = (event) => {
    if (!event.date) return false;
    const eventDate = new Date(event.date.split(' at ')[0]);
    const today = new Date();
    // Set time to 00:00:00 for both to compare only date
    eventDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    return eventDate < today;
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="home">
      <header>
        <div className="logo">SeatScape</div>
        <nav>
          <a href="#events" className={category === 'All' ? 'active' : ''} onClick={() => setCategory('All')}>Events</a>
          {/* Removed My Bookings link */}
        </nav>
      </header>
      <main>
        <section className="hero">
          <h1>
            Discover Amazing <span className="gradient-text">Events</span>
          </h1>
          <p>Book your perfect seat for concerts, conferences, theater shows, and more. </p>
          <p>Experience events like never before with our colorful and vibrant platform.</p>
          <input
            type="text"
            placeholder="Search events by name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </section>
        <section className="events">
          <div className="event-list">
            {displayEvents.map(event => (
              <div key={event.id} className="event-card">
                <img src={event.image} alt={event.name} />
                <div className="event-details">
                  <span className={`category ${event.category.toLowerCase()}`}>{event.category}</span>
                  <h3>{event.price}</h3>
                  <p style={{ fontWeight: 'bold', fontSize: '1.18rem', margin: '6px 0 2px 0' }}>{event.name}</p>
                  <p>{event.date}</p>
                  <p>{event.location}</p>
                  <p className={
                    event.seats === 0 ? 'seats-red' :
                    event.seats > 50 ? 'seats-green' :
                    'seats-red'
                  }>
                    {event.seats === 0
                      ? 'Sold Out'
                      : `${event.seats} seats available`}
                  </p>
                  <button
                    onClick={() => handleBookNow(event)}
                    disabled={event.seats === 0 || isPastEvent(event)}
                  >
                    View details & Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Book for: {selectedEvent.name}</h2>
            {selectedEvent.description && (
              <div className="event-description" style={{marginBottom: '16px', color: '#444', fontSize: '1.05rem'}}>
                <strong>Description:</strong> {selectedEvent.description}
              </div>
            )}
            <form onSubmit={handleFormSubmit}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <label>Number of Seats:</label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleFormChange}
                  min="1"
                  max={selectedEvent.seats}
                  required
                />
              </div>
              <button type="submit">Submit Booking</button>
              <button type="button" className="cancel-btn" onClick={handleCloseForm}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}
      <footer className="footer">
        <div className="footer-content" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <span>© {new Date().getFullYear()} SeatScape. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;