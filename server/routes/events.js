const express = require('express');
const Event = require('../models/Event');
const Feedback = require('../models/Feedback');
const protect = require('../middleware/protect');

const router = express.Router();

// GET /api/events (public) - all events with author name
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('author', 'name')
      .sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/:id (public) - one event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('author', 'name');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events (protected) - create an event
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ message: 'Title, description and date are required' });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      author: req.user._id,
    });

    const populated = await event.populate('author', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/events/:id (protected) - only the author can delete
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own events' });
    }

    await Feedback.deleteMany({ event: event._id });
    await event.deleteOne();

    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;