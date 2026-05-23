const express = require('express');
const Registration = require('../models/Registration');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// @POST /api/registrations — Register for an event
router.post('/', protect, async (req, res) => {
  try {
    const { eventId } = req.body;

    // Check if already registered
    const existing = await Registration.findOne({
      user: req.user.id,
      event: eventId
    });
    if (existing) {
      return res.status(400).json({ error: 'You are already registered for this event' });
    }

    const registration = await Registration.create({
      user: req.user.id,
      event: eventId
    });

    res.status(201).json({ message: 'Registered successfully', registration });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @GET /api/registrations/my — View my registrations
router.get('/my', protect, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate('event', 'title date location capacity');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @PATCH /api/registrations/:id/cancel — Cancel a registration
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const registration = await Registration.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json({ message: 'Registration cancelled', registration });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @GET /api/registrations/all — View all registrations (admin only)
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('user', 'name email')
      .populate('event', 'title date location capacity');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @GET /api/registrations/event/:eventId — View all registrations for a specific event (admin only)
router.get('/event/:eventId', protect, adminOnly, async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('user', 'name email');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
