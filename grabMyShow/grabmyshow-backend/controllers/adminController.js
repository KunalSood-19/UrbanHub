const Booking = require("../models/Booking");
const User = require("../models/User");
const Show = require("../models/Show");

console.log("User type:", typeof User);        // "function" hona chahiye
console.log("findOne type:", typeof User.findOne); // "function" hona chahiye
const jwt = require("jsonwebtoken");
// ✅ GET ANALYTICS
exports.getAnalytics = async (req, res) => {
  try {

    // ✅ Sab counts ek saath parallel mein (fast)
    const [totalBookings, totalUsers, totalShows] = await Promise.all([
      Booking.countDocuments(),
      User.countDocuments(),
      Show.countDocuments(),
    ]);

    // ✅ Total revenue — MongoDB aggregate se
    const revenueResult = await Booking.aggregate([
      { $match: { paymentStatus: "success" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // ✅ Most booked show — aggregate se seedha
    const mostBooked = await Booking.aggregate([
      { $group: { _id: "$show", bookingCount: { $sum: 1 } } },
      { $sort: { bookingCount: -1 } },
      { $limit: 1 },
      {
        $lookup: {                        // Show details bhi saath mein
          from: "shows",
          localField: "_id",
          foreignField: "_id",
          as: "showDetails",
        }
      },
      { $unwind: "$showDetails" },
    ]);

    const mostBookedShow = mostBooked[0] || null;

    res.json({
      totalRevenue,
      totalBookings,
      totalUsers,
      totalShows,
      mostBookedShow: mostBookedShow ? {
        showId:       mostBookedShow._id,
        bookingCount: mostBookedShow.bookingCount,
        showDate:     mostBookedShow.showDetails.showDate,
        showTime:     mostBookedShow.showDetails.showTime,
      } : null,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET SHOW REVENUE
exports.getShowRevenue = async (req, res) => {
  try {
    const { showId } = req.params;

    // ✅ Ek aggregate query mein revenue + seats + count sab
    const result = await Booking.aggregate([
      { $match: { show: require("mongoose").Types.ObjectId.createFromHexString(showId) } },
      {
        $group: {
          _id: "$show",
          revenue:        { $sum: "$totalAmount" },
          totalBookings:  { $sum: 1 },
          totalSeatsSold: { $sum: { $size: "$seats" } },
        }
      }
    ]);

    if (result.length === 0) {
      return res.json({
        showId,
        revenue: 0,
        totalSeatsSold: 0,
        totalBookings: 0,
      });
    }

    const data = result[0];

    res.json({
      showId,
      revenue:        data.revenue,
      totalSeatsSold: data.totalSeatsSold,
      totalBookings:  data.totalBookings,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};