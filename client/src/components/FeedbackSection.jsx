import { useState, useEffect } from 'react';
import api from '../api/axios';

function FeedbackSection({ eventId, user }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState('');

  // Runs when the component appears (and if eventId changes)
  useEffect(() => {
    const fetchFeedbacks = async () => {
      const { data } = await api.get(`/feedbacks/event/${eventId}`);
      setFeedbacks(data);
    };
    fetchFeedbacks();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/feedbacks', { text, rating, event: eventId });
      setFeedbacks([data, ...feedbacks]);
      setText('');
      setRating(5);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add feedback');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/feedbacks/${id}`);
      setFeedbacks(feedbacks.filter((f) => f._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete feedback');
    }
  };

  return (
    <div className="feedbacks">
      <h4>Feedbacks ({feedbacks.length})</h4>

      {user && (
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Your feedback"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} / 5</option>
            ))}
          </select>
          {error && <p className="error">{error}</p>}
          <button type="submit">Send feedback</button>
        </form>
      )}

      {feedbacks.length === 0 && <p>No feedback yet.</p>}

      {feedbacks.map((f) => (
        <div key={f._id} className="feedback-item">
  <div>
    <strong>{f.author?.name}</strong>{' '}
    <span className="stars">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</span>
    <div>{f.text}</div>
  </div>
  {user && user.id === f.author?._id && (
    <button className="danger" onClick={() => handleDelete(f._id)}>
      Delete
    </button>
  )}
</div>
      ))}
    </div>
  );
}

export default FeedbackSection;