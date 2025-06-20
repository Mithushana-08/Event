import React, { useState } from 'react';
import './Home.css';

function Home() {
  const [category, setCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', seats: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const events = [
    { id: 1, name: 'Kandy Esala Perahera', price: 'Rs. 5000', date: '8/10/2024 at 19:00', location: 'Kandy City Center, Kandy, Sri Lanka', seats: 2000, category: 'Cultural', image: '/images/kandy-perahera.jpg' },
    { id: 2, name: 'Colombo International Book Fair', price: 'Rs. 300', date: '9/15/2024 at 10:00', location: 'BMICH, Colombo, Sri Lanka', seats: 5000, category: 'Exhibition', image: '/images/colombo-bookfair.jpg' },
    { id: 3, name: 'Galle Literary Festival', price: 'Rs. 2500', date: '10/20/2024 at 09:00', location: 'Galle Fort, Galle, Sri Lanka', seats: 1200, category: 'Festival', image: '/images/galle-festival.jpg' },
    { id: 4, name: 'Hikka Fest', price: 'Rs. 3500', date: '7/25/2024 at 18:00', location: 'Hikkaduwa Beach, Hikkaduwa, Sri Lanka', seats: 3000, category: 'Music', image: '/images/hikka-fest.jpg' },
    { id: 5, name: 'Jaffna Music Carnival', price: 'Rs. 4000', date: '8/30/2024 at 17:00', location: 'Jaffna Town Hall, Jaffna, Sri Lanka', seats: 1800, category: 'Music', image: '/images/jaffna-carnival.jpg' },
    { id: 6, name: 'Negombo Beach Party', price: 'Rs. 3200', date: '9/12/2024 at 16:00', location: 'Negombo Beach, Negombo, Sri Lanka', seats: 2500, category: 'Party', image: '/images/negombo-beach.jpg' },
    { id: 7, name: 'Anuradhapura Poson Festival', price: 'Rs. 1000', date: '6/30/2024 at 18:00', location: 'Sacred City, Anuradhapura, Sri Lanka', seats: 4000, category: 'Cultural', image: '/images/poson-festival.jpg' },
    { id: 8, name: 'Colombo Food Fest', price: 'Rs. 1500', date: '7/20/2024 at 12:00', location: 'Galle Face Green, Colombo, Sri Lanka', seats: 3500, category: 'Food', image: '/images/colombo-foodfest.jpg' },
    { id: 9, name: 'Ella Adventure Games', price: 'Rs. 2800', date: '8/18/2024 at 09:00', location: 'Ella Town, Ella, Sri Lanka', seats: 900, category: 'Sports', image: '/images/ella-adventure.jpg' },
    { id: 10, name: 'Matara Kite Festival', price: 'Rs. 800', date: '9/5/2024 at 10:00', location: 'Polhena Beach, Matara, Sri Lanka', seats: 2200, category: 'Festival', image: '/images/matara-kite.jpg' },
  ];

  const filteredEvents = category === 'All' ? events : events.filter(event => event.category === category);

  const handleBookNow = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (parseInt(formData.seats) > selectedEvent.seats) {
      alert('Cannot book more seats than available!');
      return;
    }
    setSuccessMessage(`Booking Successful!\nEvent: ${selectedEvent.name}\nName: ${formData.name}\nEmail: ${formData.email}\nSeats: ${formData.seats}\nDate: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}`);
    setShowForm(false);
    setFormData({ name: '', email: '', seats: '' });
    setTimeout(() => setSuccessMessage(''), 5000); // Hide message after 5 seconds
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({ name: '', email: '', seats: '' });
  };

  return (
    <div className="home">
      <header>
        <div className="logo">SeatScape</div>
        <nav>
          <a href="#events" className={category === 'All' ? 'active' : ''} onClick={() => setCategory('All')}>Events</a>
          <a href="#venues">Venues</a>
          <a href="#bookings">My Bookings</a>
        </nav>
      </header>
      <main>
        <section className="hero">
          <h1>
            Discover Amazing <span className="gradient-text">Events</span>
          </h1>
          <p>Book your perfect seat for concerts, conferences, theater shows, and more. </p>
          <p>Experience events like never before with our colorful and vibrant platform.</p>
          <input type="text" placeholder="Search events, venues, or categories..." />
        </section>
        <section className="events">
          <div className="event-list">
            {filteredEvents.map(event => (
              <div key={event.id} className="event-card">
                <img src={event.image} alt={event.name} />
                <div className="event-details">
                  <span className={`category ${event.category.toLowerCase()}`}>{event.category}</span>
                  <h3>{event.price}</h3>
                  <p>{event.name}</p>
                  <p>{event.date}</p>
                  <p>{event.location}</p>
                  <p className={event.seats > 20 ? 'seats-green' : event.seats === 0 ? 'seats-red' : 'seats-red'}>
                    {event.seats > 0 ? `${event.seats} seats available` : 'Sold Out'}
                  </p>
                  <button onClick={() => handleBookNow(event)} disabled={event.seats === 0}>Book Now</button>
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