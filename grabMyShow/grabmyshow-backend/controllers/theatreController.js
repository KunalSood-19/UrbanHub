const Theatre = require("../models/Theatre");

// ✅ ADD THEATRE
exports.addTheatre = async (req, res) => {
  try {
    const { name, city, address, screens } = req.body;

    const theatre = await Theatre.create({
      name,
      city,
      address,
      screens,
    });

    res.status(201).json({
      message: "Theatre added successfully",
      theatreId: theatre._id,  // ✅ theatreRef.id ki jagah
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET THEATRES BY CITY
exports.getTheatresByCity = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: "city is required" });
    }

    const theatres = await Theatre.find({ city });
    res.json(theatres);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};