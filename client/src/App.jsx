import { useState, useEffect } from 'react';
import api from './api/axios';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import EventForm from './components/EventForm';
import EventCard from './components/EventCard';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showAuth, setShowAuth] = useState(false);
  const [events, setEvents] = useState([]);

  // Load events once when the app starts
  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await api.get('/events');
      setEvents(data);
    };
    fetchEvents();
  }, []);

  const handleLogin = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleAddEvent = async (form) => {
    const { data } = await api.post('/events', form);
    setEvents([...events, data]);
  };

  const handleDeleteEvent = async (id) => {
    await api.delete(`/events/${id}`);
    setEvents(events.filter((e) => e._id !== id));
  };

   return (
    <div className="container">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onShowAuth={() => setShowAuth(true)}
      />

      <header className="hero">
        <h2>Your club. Your events. Your voice.</h2>
        <p>Discover upcoming events and tell the club what you think.</p>
        {!user && <button onClick={() => setShowAuth(true)}>Join the club</button>}
      </header>

      {showAuth && !user && <AuthForm onSuccess={handleLogin} />}

      {user && <EventForm onAdd={handleAddEvent} />}

      <h2 className="section-title">Upcoming events</h2>
      {events.length === 0 && <p className="meta">No events yet.</p>}
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          user={user}
          onDelete={handleDeleteEvent}
        />
      ))}
    </div>
  );
}

export default App;