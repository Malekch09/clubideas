import EventCard from './EventCard';

function Landing({ events, loading, onShowAuth }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Events come sorted by date from the API, so we take the first 3 upcoming ones
  const nextEvents = events
    .filter((e) => new Date(e.date) >= today)
    .slice(0, 3);

  return (
    <>
      <section className="landing-hero">
        <div className="landing-inner">
          <span className="pill">🎓 Student club platform</span>
          <h1>Your club. Your events. Your voice.</h1>
          <p>
            Discover what's happening in the club, join the events you like and
            tell the team what you think.
          </p>
          <div className="hero-actions">
            <button className="hero-btn" onClick={onShowAuth}>Join the club</button>
            <a className="hero-link" href="#events">See upcoming events ↓</a>
          </div>
        </div>
      </section>

      <main className="container">
        <section className="features">
          <div className="feature">
            <span className="feature-icon">📅</span>
            <h3>Discover events</h3>
            <p>Browse every upcoming event of the club in one place.</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💬</span>
            <h3>Share feedback</h3>
            <p>Rate events and tell the organizers what went well.</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🚀</span>
            <h3>Organize your own</h3>
            <p>Create an account and publish your own events in seconds.</p>
          </div>
        </section>

        <h2 id="events" className="section-title">Next events</h2>
        <p className="meta">
          You are browsing as a visitor (read-only). Log in to add events and feedbacks.
        </p>

        {loading && (
          <p className="meta">Loading events... (the server may take a few seconds to wake up)</p>
        )}

        {!loading && nextEvents.length === 0 && (
          <div className="empty"><p>No upcoming events yet.</p></div>
        )}

        <section className="grid">
          {nextEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              user={null}
              onDelete={() => {}}
            />
          ))}
        </section>

        <section className="cta">
          <h2>Ready to take part?</h2>
          <p className="meta">Create a free account to add events and feedbacks.</p>
          <button onClick={onShowAuth}>Create your account</button>
        </section>
      </main>

      <footer className="footer">
        ClubIdeas · MERN project · École Polytechnique de Sousse
      </footer>
    </>
  );
}

export default Landing;