const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { verifyToken } = require("../middleware/jwtMiddleware");

// ❌ REMOVE direct booking route
// router.post("/book", verifyToken, bookingController.bookSeats);

// ✅ Only allow:
router.get("/my-bookings", verifyToken, bookingController.getUserBookings);
router.post("/cancel", verifyToken, bookingController.cancelBooking);

module.exports = router;