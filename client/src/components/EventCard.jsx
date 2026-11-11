import { useState } from 'react';
import FeedbackSection from './FeedbackSection';

function EventCard({ event, user, onDelete }) {
  const [showFeedbacks, setShowFeedbacks] = useState(false);
    if (!event) return null;
  const isOwner = user && user.id === event.author?._id;

  const d = new Date(event.date);
  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'short' });

  return (
    <div className="event-card">
      <div className="date-badge">
        <span className="day">{day}</span>
        <span className="month">{month}</span>
      </div>

      <div className="event-body">
        <h3>{event.title}</h3>
        <p className="meta">
          📍 {event.location} · by {event.author?.name}
        </p>
        <p>{event.description}</p>

        <div className="actions">
          <button className="secondary" onClick={() => setShowFeedbacks(!showFeedbacks)}>
            {showFeedbacks ? 'Hide feedbacks' : '💬 Feedbacks'}
          </button>
          {isOwner && (
            <button className="danger" onClick={() => onDelete(event._id)}>
              Delete event
            </button>
          )}
        </div>

        {showFeedbacks && <FeedbackSection eventId={event._id} user={user} />}
      </div>
    </div>
  );
}

export default EventCard;