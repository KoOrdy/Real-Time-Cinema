const { Movies, Cinemas, Users, UserDetails, Bookings, Seats, Showtimes, Notifications,} = require("../models");

exports.viewLastAddedMovies = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "You are nor authorized to view movies." });
  }
  try {
    const cinemaID = req.params.cinemaId;
    const movies = await Movies.findAll({
      include: [
        {
          model: Cinemas,
          as: "cinemas",
          where: { id: cinemaID },
          required: true,
          attributes: [],
        },
      ],
      attributes: ["id", "Poster", "title", "description", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    if (!movies || !movies.length) {
      return res.status(404).json({ message: "No movies found for this cinema." });
    }

    return res.status(200).json({ message: "Movies fetched successfully", data: movies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching movies:", data: error.message });
  }
};

exports.viewAvailableMovies = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "You are nor authorized to view movies." });
  }
  try {
    const cinemaID = req.params.cinemaId;
    const movies = await Movies.findAll({
      include: [
        {
          model: Cinemas,
          as: "cinemas",
          where: { id: cinemaID },
          required: true,
          attributes: [],
        },
      ],
    });
    if (!movies || !movies.length) {
      return res.status(404).json({ message: "No movies found for this cinema." });
    }
    return res.status(200).json({ message: "Movies fetched successfully", data: movies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching movies:", data: error.message });
  }
};

exports.viewAvailableCinemas = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "You are nor authorized to view movies." });
  }
  try {
    const cinemas = await Cinemas.findAll();

    if (!cinemas || !cinemas.length) {
      return res.status(404).json({ message: "No cinemas found." });
    }
    return res.status(200).json({ message: "Cinemas fetched successfully.", data: cinemas });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching cinemas:", data: error.message });
  }
};
