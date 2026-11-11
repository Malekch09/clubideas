import { useState } from 'react';
import FeedbackSection from './FeedbackSection';

function EventCard({ event, user, onDelete }) {
  const [showFeedbacks, setShowFeedbacks] = useState(false);

  const isOwner = user && user.id === event.author?._id;

  const d = new Date(event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPast = d < today;

  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'short' });

  return (
    <article className="event-card">
      <div className="event-top">
        <div className="date-badge">
          <span className="day">{day}</span>
          <span className="month">{month}</span>
        </div>
        <div className="event-title">
          <h3>{event.title}</h3>
          <p className="meta">📍 {event.location}</p>
        </div>
        <span className={isPast ? 'badge past' : 'badge upcoming'}>
          {isPast ? 'Past' : 'Upcoming'}
        </span>
      </div>

      <p className="event-desc">{event.description}</p>

      <div className="event-footer">
        <span className="author">👤 {event.author?.name}</span>
        <div className="actions">
          <button className="secondary" onClick={() => setShowFeedbacks(!showFeedbacks)}>
            {showFeedbacks ? 'Hide' : '💬 Feedbacks'}
          </button>
          {isOwner && (
            <button className="danger" onClick={() => onDelete(event._id)}>
              Delete
            </button>
          )}
        </div>
      </div>

      {showFeedbacks && <FeedbackSection eventId={event._id} user={user} />}
    </article>
  );
}

export default EventCard;