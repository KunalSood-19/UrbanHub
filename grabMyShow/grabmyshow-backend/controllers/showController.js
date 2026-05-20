const Show = require("../models/Show");
const Theatre = require("../models/Theatre");

// ✅ CREATE SHOW
exports.createShow = async (req, res) => {
  try {
    const { movieId, theatreId, showDate, showTime, price, totalSeats, screenNumber } = req.body; // ✅ screenNumber add kiya

    const show = await Show.create({
      movie: movieId,
      theatre: theatreId,
      showDate,
      showTime,
      price,
      screenNumber, // ✅ yeh missing tha
      totalSeats: totalSeats || 100,
      bookedSeats: [],
    });

    res.status(201).json({
      message: "Show created successfully",
      showId: show._id,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET SHOWS BY MOVIE + CITY
exports.getShowsByMovie = async (req, res) => {
  try {
    const { movieId, city } = req.query;

    if (!movieId || !city) {
      return res.status(400).json({ message: "movieId and city are required" });
    }

    // Step 1 — us city ke saare theatres find karo
    const theatres = await Theatre.find({ city });
    const theatreIds = theatres.map(t => t._id);

    // Step 2 — us movie ke shows jo in theatres mein hain
    const shows = await Show.find({
      movie: movieId,
      theatre: { $in: theatreIds },
    })
      .populate("movie", "title language genre poster duration")   // ✅ movie details
      .populate("theatre", "name city address");                   // ✅ theatre details

    res.json(shows);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET SEAT AVAILABILITY
exports.getSeatAvailability = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).select("bookedSeats price totalSeats");

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json({
      bookedSeats: show.bookedSeats,
      availableSeats: show.totalSeats - show.bookedSeats.length,  // ✅ bonus info
      totalSeats: show.totalSeats,
      price: show.price,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};