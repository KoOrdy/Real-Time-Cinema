const { Movies, Cinemas, Showtimes, Halls, Notifications ,Bookings ,Users } = require('../models');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const emailConfig = require('../config/email.config');
const transporter = nodemailer.createTransport(emailConfig);


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
    const { title, description, genre, duration, Poster, cinemaId } = req.body;

    if (req.user.role !== 'vendor') {
        return res.status(403).send({ message: "You are not authorized to add movies." });
    }

    if (!title || !genre || !duration || !cinemaId) {
        return res.status(400).send({ message: "All required fields (title, genre, duration, cinemaId) must be provided!" });
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
    const { title, description, genre, duration, Poster, cinemaId } = req.body;

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
            attributes: ['id', 'title', 'genre', 'duration', 'description', 'Poster'], 
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

exports.addHall = async (req, res) => {
    const { name, cinemaId } = req.body;

    if (req.user.role !== 'vendor') {
        return res.status(403).send({ message: "You are not authorized to add halls." });
    }

    if (!name || !cinemaId) {
        return res.status(400).send({ message: "Both 'name' and 'cinemaId' are required!" });
    }

    const hallNameRegex = /^[A-Z]$/;
    if (!hallNameRegex.test(name)) {
        return res.status(400).send({ message: "Hall name must be a single uppercase letter (A-Z)." });
    }

    try {
        const cinema = await Cinemas.findOne({
            where: { id: cinemaId, vendorId: req.user.id },
        });

        if (!cinema) {
            return res.status(404).send({ message: "Cinema not found or you are not authorized to add halls to this cinema." });
        }

        const hall = await Halls.create({
            name,
            cinemaId,
        });

        res.status(201).send({ message: "Hall added successfully!", hall });
    } catch (error) {
        res.status(500).send({ message: "Error: " + error.message });
    }
};


exports.getHallsByCinema = async (req, res) => {
    const { cinemaId } = req.params;

    if (req.user.role !== 'vendor') {
        return res.status(403).send({ message: "You are not authorized to view halls." });
    }

    if (!cinemaId) {
        return res.status(400).send({ message: "Cinema ID is required!" });
    }

    try {
        const cinema = await Cinemas.findOne({
            where: { id: cinemaId, vendorId: req.user.id },
        });

        if (!cinema) {
            return res.status(404).send({ message: "Cinema not found or you are not authorized to view halls for this cinema." });
        }

        const halls = await Halls.findAll({
            where: { cinemaId },
            attributes: ['id', 'name'],
        });

        res.status(200).send({ message: "Halls retrieved successfully!", halls });
    } catch (error) {
        res.status(500).send({ message: "Error: " + error.message });
    }
};

//-------------------------------------------------------------------------------------------\\

exports.addShowtime = async (req, res) => {
    const { date, startTime, endTime } = req.body;

    if (req.user.role !== 'vendor') {
        return res.status(403).send({ message: "You are not authorized to add showtimes." });
    }

    if (!date || !startTime || !endTime) {
        return res.status(400).send({ message: "All required fields (date, startTime, endTime) must be provided!" });
    }

    try {
        const showtime = await Showtimes.create({
            date,
            startTime,
            endTime,
            vendorId: req.user.id,
        });

        res.status(201).send({ message: "Showtime added successfully!", showtime });
    } catch (error) {
        res.status(500).send({ message: "Error: " + error.message });
    }
};


exports.updateShowTime = async (req, res) => {
    const { date, startTime, endTime } = req.body;
    const { id } = req.params;

    if (req.user.role !== 'vendor') {
        return res.status(403).send({ message: "You are not authorized to update showtimes." });
    }

    try {
        const showtime = await Showtimes.findByPk(id);

        if (!showtime) {
            return res.status(404).send({ message: "Showtime not found!" });
        }

        if (date) showtime.date = date;
        if (startTime) showtime.startTime = startTime;
        if (endTime) showtime.endTime = endTime;
        await showtime.save();

        const bookings = await Bookings.findAll({ where: { showtimeId: id } });

        if (bookings.length === 0) {
            return res.status(200).send({ 
                message: "Showtime updated successfully, but no customers booked this showtime.", 
                showtime 
            });
        }

        const customerIds = bookings.map(booking => booking.customerId);

        const customers = await Users.findAll({
            where: { id: customerIds },
            attributes: ['id', 'email']
        });

        for (const customer of customers) {
            const mailOptions = {
                from: emailConfig.auth.user,
                to: customer.email,
                subject: 'Showtime Updated',
                text: `Dear Customer,\n\nThe showtime you booked has been updated. Here are the new details:\n\nDate: ${date || showtime.date}\nStart Time: ${startTime || showtime.startTime}\nEnd Time: ${endTime || showtime.endTime}\n\n Thank you for your understanding.\n\nRegards❤️, `
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(200).send({ 
            message: "Showtime updated successfully, and emails sent to customers.", 
            showtime 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error: " + error.message });
    }
};
