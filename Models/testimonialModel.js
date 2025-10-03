// models/Testimonial.js
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  course: {
    type: String,
    enum: ['SAP MM', 'SAP WM', 'SAP FICO'],
    required: true
  },
  name: { type: String, required: true },
  company: { type: String },
  salary: { type: String },
  message: { type: String, required: true },
  imageUrl: { type: String },
  videoUrl: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true, // You can change this based on whether you want to make the rating optional
    validate: {
      validator: function(value) {
        return value >= 1 && value <= 5;
      },
      message: 'Rating must be between 1 and 5.'
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
