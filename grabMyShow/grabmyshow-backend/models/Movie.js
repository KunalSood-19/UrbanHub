const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,  // ✅
    trim: true       // ✅ extra spaces remove karega
  },
  description: {
    type: String,
    trim: true       // ✅
  },
  language: {
    type: String,
    required: true   // ✅
  },
  duration: {
    type: Number,
    required: true   // ✅ minutes mein
  },
  genre: [String],
  poster: {
    type: String,    // Cloudinary URL yahan store hogi
    required: true   // ✅
  },
  rating: {
    type: Number,
    min: 0,          // ✅
    max: 10          // ✅
  },
  releaseDate: {
    type: Date,
    required: true   // ✅
  }
}, { timestamps: true }); // ✅ createdAt & updatedAt auto-milega

module.exports = mongoose.model("Movie", movieSchema);