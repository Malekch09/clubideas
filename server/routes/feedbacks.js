const express = require('express');
const Feedback = require('../models/Feedback');
const Event = require('../models/Event');
const protect = require('../middleware/protect');

const router = express.Router();

// GET /api/feedbacks/event/:eventId (public) - feedbacks of one event
router.get('/event/:eventId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ event: req.params.eventId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/feedbacks (protected) - add a feedback to an event
router.post('/', protect, async (req, res) => {
  try {
    const { text, rating, event } = req.body;

    if (!text || !event) {
      return res.status(400).json({ message: 'Text and event are required' });
    }

    const eventExists = await Event.findById(event);
    if (!eventExists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const feedback = await Feedback.create({
      text,
      rating,
      event,
      author: req.user._id,
    });

    const populated = await feedback.populate('author', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/feedbacks/:id (protected) - only the author can delete
router.delete('/:id', protect, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own feedbacks' });
    }

    await feedback.deleteOne();
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;