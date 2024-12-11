const { Movies, Cinemas, Showtimes, Halls, Notifications ,Bookings ,Users, Seats} = require('../models');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const emailConfig = require('../config/email.config');
const transporter = nodemailer.createTransport(emailConfig);

//-----------------------------------Cinema Management--------------------------------------------------------\\

//-----------------add cinema----------------------//

exports.addCinema = async (req, res) => {
    const { name, location, contactInfo } = req.body;

    if (!name || !location || !contactInfo) {
        return res.status(400).send({ message: "All fields are required!" });
    }

    try {
        const vendorExists = await Users.findOne({
            where: { id: req.user.id, role: 'vendor' },
        });

        if (!vendorExists) {
            return res.status(404).send({ message: "Vendor not found." });
        }

        const locationExists = await Cinemas.findOne({
            where: { location },
        });

        if (locationExists) {
            return res.status(409).send({ message: "Cinema location must be unique." });
        }

        const cinema = await Cinemas.create({
            name,
            location,
            contactInfo: contactInfo,
            vendorId: req.user.id,
        });

        res.status(201).send({ message: "Cinema added successfully!", cinema });
    } catch (error) {
        res.status(500).send({ message: "Error: " + error.message });
    }
};

//-----------------update cinema----------------------//

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

        if (location) {
            const locationExists = await Cinemas.findOne({
                where: { location, id: { [Op.ne]: id } },
            });

            if (locationExists) {
                return res.status(409).send({ message: "Cinema location must be unique." });
            }
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

//-----------------delete cinema----------------------//
exports.deleteCinema = async (req, res) => {
    try {

        const id = req.params.id;
        const cinema = await Cinemas.findOne({
            where: { id, vendorId: req.user.id },
        });

        if (!cinema) {
            return res.status(404).send({
                message: "Cinema not found or you do not have access to delete it.",
            });
        }

        await cinema.destroy();

        res.status(200).send({ message: "Cinema deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: "Error: " + error.message });
    }
};

//-----------------list cinemas----------------------//
exports.listVendorCinemas = async (req, res) => {
    try {
        if (req.user.role !== "vendor") {
            return res.status(403).json({
                message: "You are not authorized to view cinemas.",
            });
        }

        const vendorId = req.user.id;

        const cinemas = await Cinemas.findAll({
            where: { vendorId },
            attributes: ["name", "location", "contactInfo"],
        });

        if (!cinemas || cinemas.length === 0) {
            return res.status(404).json({
                message: "No cinemas found for this vendor.",
            });
        }

        return res.status(200).json({
            message: "Cinemas fetched successfully.",
            data: cinemas,
        });
    } catch (error) {
        console.error("Error fetching cinemas:", error);
        return res.status(500).json({
            message: "Error fetching cinemas.",
            error: error.message,
        });
    }
};

//-----------------------------------Hall Management--------------------------------------------------------\\

//-----------------add hall----------------------//

exports.addHall = async (req, res) => {
    try {
        const { name, cinemaId } = req.body;

        if (req.user.role !== "vendor") {
            return res.status(403).send({ message: "You are not authorized to add halls." });
        }

        if (!name || !cinemaId) {
            return res.status(400).send({
                message: "Both 'name' and 'cinemaId' are required!",
            });
        }

        const hallNameRegex = /^[A-Z]$/;
        if (!hallNameRegex.test(name)) {
            return res.status(400).send({
                message: "Hall name must be a single uppercase letter (A-Z).",
            });
        }

        const cinema = await Cinemas.findOne({
            where: { id: cinemaId, vendorId: req.user.id },
        });

        if (!cinema) {
            return res.status(404).send({
                message:
                    "Cinema not found or you are not authorized to add halls to this cinema.",
            });
        }

        const existingHall = await Halls.findOne({
            where: { name, cinemaId },
        });

        if (existingHall) {
            return res.status(400).send({
                message: `A hall with the name '${name}' already exists in this cinema.`,
            });
        }

        const hall = await Halls.create({
            name,
            cinemaId,
        });

        const seats = [];
        for (let row = 1; row <= 47; row++) {
            seats.push({
                seatNum: `${row}${name}`, // Dynamic seat numbering (e.g., "1A", "2A")
                hallId: hall.id,
                cinemaId: cinemaId,
            });
        }

        await Seats.bulkCreate(seats);

        res.status(201).send({
            message: "Hall and seats added successfully!",
            hall,
        });
    } catch (error) {
        console.error("Error adding hall:", error);
        res.status(500).send({
            message: "Error adding hall.",
            error: error.message,
        });
    }
};


//-----------------list halls ----------------------//

exports.listCinemaHalls = async (req, res) => {
    try {
        const { cinemaId } = req.params;

        if (!cinemaId) {
            return res.status(400).json({ message: "Cinema ID is required!" });
        }

        const cinema = await Cinemas.findOne({
            where: { id: cinemaId, vendorId: req.user.id },
        });

        if (!cinema) {
            return res.status(404).json({ message: "Cinema not found or you are not authorized to view halls for this cinema." });
        }

        const halls = await Halls.findAll({
            where: { cinemaId },
            attributes: ['name', 'capacity'], 
        });

        if (halls.length === 0) {
            return res.status(404).json({ message: "No halls found for this cinema." });
        }

        res.status(200).json({ 
            message: "Halls retrieved successfully!",
            data: halls 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving halls.", error: error.message });
    }
};

//-----------------------------------movie Management--------------------------------------------------------\\

//-----------------add movie----------------------//

exports.addMovie = async (req, res) => {
    try {
        const { title, description, genre, duration, price, poster, cinemaId } = req.body;


        if (!title || !genre || !duration || !price || !cinemaId || !poster) {
            return res.status(400).json({
              message: "All required fields (title, genre, duration, price, cinemaId, poster) must be provided!",
            });
          }

        const validGenres = [ 'comedy', 'drama', 'romance', 'action', 'animation', 'horror', 'sci-fi', 'fantasy', 'mystery', 'documentary'];
        if (!validGenres.includes(genre)) {
            return res.status(400).json({ message: `Invalid genre. Allowed genres are: ${validGenres.join(', ')}.` });
        }

        const cinema = await Cinemas.findOne({
            where: { id: cinemaId, vendorId: req.user.id },
        });

        if (!cinema) {
            return res.status(404).json({ message: "Cinema not found or you are not authorized to add movies to this cinema." });
        }

        const existingMovie = await Movies.findOne({
            where: {
              title,
              cinemaId,
            },
          });
      
          if (existingMovie) {
            return res.status(400).json({
              message: `The movie "${title}" already exists in the specified cinema.`,
            });
          }

        const movie = await Movies.create({
            title,
            description: description || null,
            genre,
            duration,
            price: price,
            poster: poster || null,
            vendorId: req.user.id,
            cinemaId,
        });

        res.status(201).json({ 
            message: "Movie added successfully!",
            data: movie,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding movie.", error: error.message });
    }
};

//-----------------update movie----------------------//

exports.updateMovie = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { title, description, genre, duration, price, poster } = req.body;

        const movie = await Movies.findByPk(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found." });
        }

        const cinema = await Cinemas.findByPk(movie.cinemaId);
        if (!cinema || cinema.vendorId !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this movie." });
        }

        if (genre) {
            const validGenres = ['comedy', 'drama', 'romance', 'action', 'animation', 'horror', 'sci-fi', 'fantasy', 'mystery', 'documentary'];
            if (!validGenres.includes(genre)) {
                return res.status(400).json({ message: `Invalid genre. Allowed genres are: ${validGenres.join(', ')}.` });
            }
        }

        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (description !== undefined) updatedFields.description = description || null;
        if (genre) updatedFields.genre = genre;
        if (duration) updatedFields.duration = duration;
        if (price) updatedFields.price = price;
        if (poster !== undefined) updatedFields.poster = poster || null;

        await movie.update(updatedFields);

        res.status(200).json({
            message: "Movie updated successfully!",
            data: movie,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating movie.", error: error.message });
    }
};

//-----------------delete movie----------------------//

exports.deleteMovie = async (req, res) => {
    try {
        const { movieId } = req.params;

        const movie = await Movies.findOne({
            where: { id: movieId },
            include: {
                model: Cinemas,
                as: 'cinema',
                where: { vendorId: req.user.id },
                attributes: ['id'],
            },
        });

        if (!movie) {
            return res.status(404).json({ message: "Movie not found or you are not authorized to delete it." });
        }

        await Movies.destroy({ where: { id: movieId } });

        res.status(200).json({ message: "Movie and all related data deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting movie.", error: error.message });
    }
};

//-----------------list movies----------------------//

// exports.viewAvailableMovies = async (req, res) => {
//     if (req.user.role !== "vendor") {
//         return res.status(403).json({ message: "You are not authorized to view movies." });
//     }

//     try {
//         const cinemaID = req.params.cinemaId;

//         const cinema = await Cinemas.findOne({
//             where: { id: cinemaID, vendorId: req.user.id },
//         });

//         if (!cinema) {
//             return res.status(404).json({ message: "Cinema not found or you are not authorized to view its movies." });
//         }

//         const movies = await Movies.findAll({
//             where: { cinemaId: cinemaID }, 
//             attributes: ['id', 'title', 'genre', 'duration', 'description', 'Poster'], 
//         });

//         if (!movies || !movies.length) {
//             return res.status(404).json({ message: "No movies found for this cinema." });
//         }

//         return res.status(200).json({ message: "Movies fetched successfully!", data: movies });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Error fetching movies", data: error.message });
//     }
// };

// //-----------------------------------Showtime Management--------------------------------------------------------\\

// //-----------------add showtime----------------------//

// exports.addShowtime = async (req, res) => {
//     const { date, startTime, endTime } = req.body;

//     if (req.user.role !== 'vendor') {
//         return res.status(403).send({ message: "You are not authorized to add showtimes." });
//     }

//     if (!date || !startTime || !endTime) {
//         return res.status(400).send({ message: "All required fields (date, startTime, endTime) must be provided!" });
//     }

//     try {
//         const showtime = await Showtimes.create({
//             date,
//             startTime,
//             endTime,
//             vendorId: req.user.id,
//         });

//         res.status(201).send({ message: "Showtime added successfully!", showtime });
//     } catch (error) {
//         res.status(500).send({ message: "Error: " + error.message });
//     }
// };

//-----------------update showtime----------------------//

// exports.updateShowTime = async (req, res) => {
//     const { date, startTime, endTime } = req.body;
//     const { id } = req.params;

//     try {
//         const showtime = await Showtimes.findByPk(id);

//         if (!showtime || showtime.vendorId !== req.user.id) {
//             return res.status(404).send({ message: "Showtime not found!" });
//         }

//         if (date) showtime.date = date;
//         if (startTime) showtime.startTime = startTime;
//         if (endTime) showtime.endTime = endTime;
//         await showtime.save();

//         const bookings = await Bookings.findAll({ where: { showtimeId: id } });

//         if (bookings.length === 0) {
//             return res.status(200).send({ 
//                 message: "Showtime updated successfully, but no customers booked this showtime.", 
//                 showtime 
//             });
//         }

//         const customerIds = bookings.map(booking => booking.customerId);

//         const customers = await Users.findAll({
//             where: { id: customerIds },
//             attributes: ['id', 'email', 'username']
//         });

//         for (const customer of customers) {
//             const mailOptions = {
//                 from: emailConfig.auth.user,
//                 to: customer.email,
//                 subject: 'Showtime Updated',
//                 html: `
//                     <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//                         <div style="max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
//                             <!-- Header -->
//                             <div style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
//                                 <h1 style="margin: 0; font-size: 24px;">🎥 Showtime Updated!</h1>
//                                 <p style="margin: 0; font-size: 14px;">Important Notification</p>
//                             </div>
        
//                             <!-- Body -->
//                             <div style="padding: 20px;">
//                                 <p style="font-size: 18px; margin: 0 0 10px;">Dear <strong>${customer.username}😁</strong>,</p>
//                                 <p style="margin: 10px 0;">The showtime you booked has been updated. Here are the new details:</p>
//                                 <div style="padding: 15px; background-color: #f9f9f9; border: 1px solid #4CAF50; border-radius: 5px; margin: 10px 0;">
//                                     <p style="margin: 5px 0;"><strong>Date:</strong> ${date || showtime.date}</p>
//                                     <p style="margin: 5px 0;"><strong>Start Time:</strong> ${startTime || showtime.startTime}</p>
//                                     <p style="margin: 5px 0;"><strong>End Time:</strong> ${endTime || showtime.endTime}</p>
//                                 </div>
//                                 <p style="margin: 20px 0 0;">Thank you for your understanding. We look forward to welcoming you soon!</p>
//                             </div>
        
//                             <!-- Footer -->
//                             <div style="background-color: #f7f7f7; padding: 10px; text-align: center; border-top: 1px solid #ddd;">
//                                 <p style="font-size: 14px; margin: 0; color: #555;">❤ Regards, <br> Your Cinema Team</p>
//                             </div>
//                         </div>
//                     </div>
//                 `
//             };
        
//             await transporter.sendMail(mailOptions);
//         }
        

//         res.status(200).send({ 
//             message: "Showtime updated successfully, and emails sent to customers.", 
//             showtime 
//         });
//     } catch (error) {
//         res.status(500).send({ message: "Error: " + error.message });
//     }
// };

// //-----------------delete showtime----------------------//

// exports.deleteShowtime = async (req, res) => {
//     const { id } = req.params;
    
//     if (req.user.role!== 'vendor') {
//         return res.status(403).send({ message: "You are not authorized to delete showtimes." });
//     }

//     try{
//         const showtime = await Showtimes.findByPk(id);

//         if (!showtime || showtime.vendorId!== req.user.id) {
//             return res.status(404).send({ message: "Showtime not found or you do not have access to delete it." });
//         }

//         await Showtimes.destroy({
//             where: { id: id },
//         });

//         res.status(200).send({ message: "Showtime deleted successfully!" });
//     }catch(error){
//         res.status(500).send({ message: "Error: " + error.message });
//     }

// }

// //-----------------------------------seat map--------------------------------------------------------\\
// //-----------------------------------Notification Management--------------------------------------------------------\\
