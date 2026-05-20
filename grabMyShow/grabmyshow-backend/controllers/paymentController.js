const Razorpay = require("razorpay");
const crypto = require("crypto");
const Show = require("../models/Show");
const Booking = require("../models/Booking");

// ✅ Razorpay initialize
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ CREATE ORDER — yeh missing tha!
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const options = {
      amount: amount * 100, // paise mein
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    return res.json(order);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ VERIFY PAYMENT
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, showId, seats } = req.body;
    const userId = req.user?.id;

    // 🔐 Signature verify
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body).digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: "Show not found" });

    const conflictSeat = seats.find(seat => show.bookedSeats.includes(seat));
    if (conflictSeat) return res.status(400).json({ message: `Seat ${conflictSeat} already booked` });

    show.bookedSeats = [...show.bookedSeats, ...seats];
    await show.save();

    const booking = await Booking.create({
      user: userId,
      show: showId,
      seats,
      totalAmount: seats.length * show.price,
      paymentStatus: "success",
      razorpay_order_id,
      razorpay_payment_id,
    });

    return res.json({
      message: "Payment verified & booking confirmed",
      bookingId: booking._id
    });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};