const { Movies, Cinemas, Showtimes, Halls, Notifications } = require('../models');

exports.addCinema = async (req, res) => { 
    const { name, location, contactInfo } = req.body;

    if (req.user.role !== 'vendor') {
        return res.status(403).send({ message: "You are not authorized to add cinemas." });
    }

    if (!name || !location || !contactInfo) {
        return res.status(400).send({ message: "All fields are required!" });
    }

    try {
        const cinema = await Cinemas.create({
            name,
            location,
            contactInfo,
            vendorId: req.user.id,
        });

        res.status(201).send({ message: "Cinema added successfully!", cinema });
    } catch (error) {
        res.status(500).send({ message: "Error: " + error.message });
    }
};

exports.updateCinema = async (req, res) => {
    const { id } = req.params;
    const { name, location, contactInfo } = req.body;

    if (!['vendor', 'admin'].includes(req.user.role)) {
        return res.status(403).send({ message: "You are not authorized to update cinemas." });
    }

    try {
        const cinema = await Cinemas.findByPk(id);
        
        if (!cinema) {
            return res.status(404).send({ message: "Cinema not found." });
        }

        if (req.user.role === 'vendor' && cinema.vendorId !== req.user.id) {
            return res.status(403).send({ message: "You are not authorized to update this cinema." });
        }

        const updatedData = {};
        if (name) updatedData.name = name;
        if (location) updatedData.location = location;
        if (contactInfo) updatedData.contactInfo = contactInfo;

        await cinema.update(updatedData);
        res.status(200).send({ message: "Cinema updated successfully!", cinema });

    } catch (error) {
        res.status(500).send({ message: "Error: " + error.message });
    }
};

exports.deleteCinema = async (req, res) => {
    try {
        if (req.user.role !== 'vendor') {
            return res.status(403).send({ message: "You are not authorized to delete cinemas." });
        }

        const id = req.params.id;

        const cinema = await Cinemas.findOne({
            where: { id: id, vendorId: req.user.id },
        });

        if (!cinema) {
            return res.status(404).send({ message: "Cinema not found or you do not have access to delete it." });
        }

        await Cinemas.destroy({
            where: { id: id },
        });

        res.send({ message: "Cinema deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: "Error: " + error.message });
    }
};

exports.viewAvailableCinemas = async (req, res) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "You are not authorized to view cinemas." });
  }

  try {
    const vendorId = req.user.id; 
    const cinemas = await Cinemas.findAll({ where: { vendorId } });

    if (!cinemas || cinemas.length === 0) {
      return res.status(404).json({ message: "No cinemas found for this vendor." });
    }

    return res.status(200).json({ message: "Cinemas fetched successfully.", data: cinemas});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching cinemas.", error: error.message });
  }
};

//-------------------------------------------------------------------------------------------\\

exports.addMovie = async (req, res) => {
    const { title, description, genre, releaseDate, duration, Poster, cinemaId } = req.body;

    if (req.user.role !== 'vendor') {
        return res.status(403).send({ message: "You are not authorized to add movies." });
    }

    if (!title || !genre || !releaseDate || !duration || !cinemaId) {
        return res.status(400).send({ message: "All required fields (title, genre, releaseDate, duration, cinemaId) must be provided!" });
    }

    try {
        const cinema = await Cinemas.findOne({
            where: { id: cinemaId, vendorId: req.user.id },
        });

        if (!cinema) {
            return res.status(404).send({ message: "Cinema not found or you are not authorized to add movies to this cinema." });
        }

        const movie = await Movies.create({
            title,
            description: description || null,
            genre,
            releaseDate,
            duration,
            Poster: Poster || null,
            vendorId: req.user.id,
            cinemaId, 
        });

        res.status(201).send({ message: "Movie added successfully!", movie });
    } catch (error) {
        res.status(500).send({ message: "Error: " + error.message });
    }
};


exports.updateMovie = async (req, res) => {
    const { id } = req.params;
    const { title, description, genre, releaseDate, duration, Poster, cinemaId } = req.body;

    if (req.user.role !== 'vendor') {
        return res.status(403).send({ message: "You are not authorized to update movies." });
    }

    try {
        const movie = await Movies.findByPk(id);

        if (!movie) {
            return res.status(404).send({ message: "Movie not found." });
        }

        const cinema = await Cinemas.findByPk(movie.cinemaId);

        if (!cinema || cinema.vendorId !== req.user.id) {
            return res.status(403).send({ message: "You are not authorized to update this movie." });
        }

        if (cinemaId) {
            const newCinema = await Cinemas.findOne({
                where: { id: cinemaId, vendorId: req.user.id },
            });

            if (!newCinema) {
                return res.status(404).send({
                    message: "New cinema not found or you are not authorized to update movies in this cinema.",
                });
            }
        }

        const updatedData = {};
        if (title) updatedData.title = title;
        if (description) updatedData.description = description || null;
        if (genre) updatedData.genre = genre;
        if (releaseDate) updatedData.releaseDate = releaseDate;
        if (duration) updatedData.duration = duration;
        if (Poster) updatedData.Poster = Poster || null;
        if (cinemaId) updatedData.cinemaId = cinemaId;

        await movie.update(updatedData);

        res.status(200).send({ message: "Movie updated successfully!", movie });

    } catch (error) {
        res.status(500).send({ message: "Error: " + error.message });
    }
};


exports.deleteMovie = async (req, res) => {
    try {
        if (req.user.role !== 'vendor') {
            return res.status(403).send({ message: "You are not authorized to delete movies." });
        }

        const id = req.params.id;

        const movie = await Movies.findByPk(id, {
            include: {
                model: Cinemas,
                as: 'cinema',
                where: { vendorId: req.user.id },
                attributes: ['id'], 
            },
        });

        if (!movie) {
            return res.status(404).send({ message: "Movie not found or you are not authorized to delete it." });
        }

        await Movies.destroy({
            where: { id: id },
        });

        res.send({ message: "Movie deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: "Error: " + error.message });
    }
};


exports.viewAvailableMovies = async (req, res) => {
    if (req.user.role !== "vendor") {
        return res.status(403).json({ message: "You are not authorized to view movies." });
    }

    try {
        const cinemaID = req.params.cinemaId;

        const cinema = await Cinemas.findOne({
            where: { id: cinemaID, vendorId: req.user.id },
        });

        if (!cinema) {
            return res.status(404).json({ message: "Cinema not found or you are not authorized to view its movies." });
        }

        const movies = await Movies.findAll({
            where: { cinemaId: cinemaID }, 
            attributes: ['id', 'title', 'genre', 'releaseDate', 'duration', 'description', 'Poster'], 
        });

        if (!movies || !movies.length) {
            return res.status(404).json({ message: "No movies found for this cinema." });
        }

        return res.status(200).json({ message: "Movies fetched successfully!", data: movies });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching movies", data: error.message });
    }
};

//-------------------------------------------------------------------------------------------\\
