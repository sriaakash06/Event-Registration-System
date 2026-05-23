const express = require('express');
const Event = require('../models/Event');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// @GET /api/events — Get all events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @GET /api/events/:id — Get single event (public)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: 'Invalid Event ID' });
  }
});

// @POST /api/events — Create event (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, date, location, capacity } = req.body;
    const event = await Event.create({
      title,
      description,
      date,
      location,
      capacity,
      organizer: req.user.id
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @PUT /api/events/:id — Update event (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @DELETE /api/events/:id — Delete event (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
