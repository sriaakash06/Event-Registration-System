const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  capacity: {
    type: Number,
    default: 100
  },
  category: {
    type: String,
    default: 'General'
  },
  tags: {
    type: [String],
    default: []
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
