const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: String,

  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
    required: true
  },

  seats: {
    type: [String],   // ✅ FIXED
    required: true
  },

  totalAmount: Number,

  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);