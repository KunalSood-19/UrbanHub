const Movie = require("../models/Movie");

// ✅ CREATE MOVIE (Admin)
exports.createMovie = async (req, res) => {
  try {
    const { title, description, duration, language, genre, poster, rating, releaseDate } = req.body;

    const movie = await Movie.create({
      title,
      description,
      duration,
      language,
      genre,
      poster,
      rating,
      releaseDate
    });

    res.status(201).json({
      message: "Movie Created Successfully",
      movie  // ✅ movieRef.id ki jagah pura movie object return hoga
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET ALL MOVIES
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 }); // latest pehle
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET MOVIE BY ID
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};