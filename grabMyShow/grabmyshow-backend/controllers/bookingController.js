const Booking = require("../models/Booking");  // ✅ import
const Show = require("../models/Show");         // ✅ import

exports.bookSeats = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.user.id;

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
    });

    res.status(201).json({ message: "Booking successful", booking });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ getUserBookings — yeh missing tha!
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "show",
        select: "showDate showTime price movie theatre",
        populate: [
          { path: "movie",   select: "title language genre poster" },
          { path: "theatre", select: "name city address" }
        ]
      })
      .sort({ bookingDate: -1 });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const show = await Show.findById(booking.show);
    if (!show) return res.status(404).json({ message: "Show not found" });

    show.bookedSeats = show.bookedSeats.filter(seat => !booking.seats.includes(seat));
    await show.save();

    await Booking.findByIdAndDelete(bookingId);

    res.json({ message: "Booking cancelled successfully" });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};