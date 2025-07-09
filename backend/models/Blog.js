const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  url: { type: String, required: true },
  fullText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', BlogSchema); 