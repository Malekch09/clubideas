import { useState } from 'react';

function EventForm({ onAdd }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onAdd(form);
      setForm({ title: '', description: '', date: '', location: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create the event');
    }
  };

  return (
    <div className="card">
      <h2>Add an event</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="date" type="date" value={form.date} onChange={handleChange} />
        <input name="location" placeholder="Location (optional)" value={form.location} onChange={handleChange} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Add event</button>
      </form>
    </div>
  );
}

export default EventForm;