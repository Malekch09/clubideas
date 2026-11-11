
import { useState, useEffect, useCallback } from 'react';
import api from './api/axios';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import AuthForm from './components/AuthForm';
import EventForm from './components/EventForm';
import EventCard from './components/EventCard';
import Landing from './components/Landing';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchEvents = useCallback(async () => {
    try {
      const { data } = await api.get('/events');
      setEvents(Array.isArray(data) ? data.filter(Boolean) : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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
    await api.post('/events', form);
    await fetchEvents();
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await api.delete(`/events/${id}`);
    setEvents(events.filter((e) => e._id !== id));
  };

  // Visitor clicks "New event" -> login popup. Member -> event popup.
  const handleAddClick = () => {
    if (user) setShowEventForm(true);
    else setShowAuth(true);
  };

  // ---- Derived data for stats and filters ----
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingCount = events.filter((e) => new Date(e.date) >= today).length;
  const myCount = user ? events.filter((e) => e.author?._id === user.id).length : 0;

  const visibleEvents = events
    .filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
    .filter((e) => {
      if (filter === 'upcoming') return new Date(e.date) >= today;
      if (filter === 'past') return new Date(e.date) < today;
      return true;
    });

  return (
    <>
      <Navbar
        user={user}
        onLogout={handleLogout}
        onShowAuth={() => setShowAuth(true)}
      />

      {user ? (
        <main className="container">
          <section className="page-header">
            <div>
              <h1>Events dashboard</h1>
              <p>Everything happening in the club, in one place.</p>
            </div>
            <button className="add-btn" onClick={handleAddClick}>＋ New event</button>
          </section>

          <section className="stats">
            <div className="stat">
              <span className="stat-number">{events.length}</span>
              <span className="stat-label">Total events</span>
            </div>
            <div className="stat">
              <span className="stat-number">{upcomingCount}</span>
              <span className="stat-label">Upcoming</span>
            </div>
            <div className="stat">
              <span className="stat-number">{myCount}</span>
              <span className="stat-label">My events</span>
            </div>
          </section>

          <section className="toolbar">
            <input
              className="search"
              placeholder="🔍 Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="tabs">
              {['all', 'upcoming', 'past'].map((f) => (
                <button
                  key={f}
                  className={filter === f ? 'tab active' : 'tab'}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </section>

          {loading && (
            <p className="meta">Loading events... (the server may take a few seconds to wake up)</p>
          )}

          {!loading && visibleEvents.length === 0 && (
            <div className="empty">
              <p>No events found.</p>
            </div>
          )}

          <section className="grid">
            {visibleEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                user={user}
                onDelete={handleDeleteEvent}
              />
            ))}
          </section>
        </main>
      ) : (
        <Landing
          events={events}
          loading={loading}
          onShowAuth={() => setShowAuth(true)}
        />
      )}

      {showAuth && !user && (
        <Modal title="Welcome to ClubIdeas" onClose={() => setShowAuth(false)}>
          <AuthForm onSuccess={handleLogin} />
        </Modal>
      )}

      {showEventForm && user && (
        <Modal title="New event" onClose={() => setShowEventForm(false)}>
          <EventForm
            onAdd={handleAddEvent}
            onDone={() => setShowEventForm(false)}
          />
        </Modal>
      )}
    </>
  );
}

export default App;