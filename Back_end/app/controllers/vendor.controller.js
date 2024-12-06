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

//-----------------hall details----------------------//

// exports.getHallDetails = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!id) {
//             return res.status(400).json({ message: "Hall ID is required!" });
//         }

//         const hall = await Halls.findOne({
//             where: { id: id },
//             include: [
//                 {
//                     model: Cinemas,
//                     as: 'cinema',
//                     attributes: ['name'], 
//                 },
//             ],
//         });

//         if (!hall) {
//             return res.status(404).json({ message: "Hall not found." });
//         }

//         const showtimes = await Showtimes.findAll({
//             where: { hallId: id },
//             attributes: ['date', 'movieId', 'startTime', 'endTime'],
//             include: [
//                 {
//                     model: Movies,
//                     as: 'movie',
//                     attributes: ['title', 'genre'],
//                 },
//             ],
//         });

//         const moviesByDate = showtimes.reduce((acc, showtime) => {
//             const existing = acc.find(entry => entry.date === showtime.date);
//             if (!existing) {
//                 acc.push({
//                     date: showtime.date,
//                     startTime: showtime.startTime,
//                     endTime: showtime.endTime,
//                     movie: {
//                         id: showtime.movieId,
//                         title: showtime.movie?.title || 'Unknown Title',
//                         genre: showtime.movie?.genre || 'Unknown Genre',
//                     },
//                 });
//             }
//             return acc;
//         }, []);

//         const hallDetails = {
//             name: hall.name,
//             capacity: hall.capacity,
//             cinema: hall.cinema,
//             movies: moviesByDate,
//         };

//         res.status(200).json({
//             message: "Hall details fetched successfully.",
//             data: hallDetails,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error fetching hall details.", error: error.message });
//     }
// };

//-----------------list halls ----------------------//

// exports.getHallsByCinema = async (req, res) => {
//     const { cinemaId } = req.params;

//     if (req.user.role !== 'vendor') {
//         return res.status(403).send({ message: "You are not authorized to view halls." });
//     }

//     if (!cinemaId) {
//         return res.status(400).send({ message: "Cinema ID is required!" });
//     }

//     try {
//         const cinema = await Cinemas.findOne({
//             where: { id: cinemaId, vendorId: req.user.id },
//         });

//         if (!cinema) {
//             return res.status(404).send({ message: "Cinema not found or you are not authorized to view halls for this cinema." });
//         }

//         const halls = await Halls.findAll({
//             where: { cinemaId },
//             attributes: ['id', 'name'],
//         });

//         res.status(200).send({ message: "Halls retrieved successfully!", halls });
//     } catch (error) {
//         res.status(500).send({ message: "Error: " + error.message });
//     }
// };

//-----------------------------------movie Management--------------------------------------------------------\\

// //-----------------add movie----------------------//

// exports.addMovie = async (req, res) => {
//     const { title, description, genre, duration, Poster, cinemaId } = req.body;

//     if (req.user.role !== 'vendor') {
//         return res.status(403).send({ message: "You are not authorized to add movies." });
//     }

//     if (!title || !genre || !duration || !cinemaId) {
//         return res.status(400).send({ message: "All required fields (title, genre, duration, cinemaId) must be provided!" });
//     }

//     try {
//         const cinema = await Cinemas.findOne({
//             where: { id: cinemaId, vendorId: req.user.id },
//         });

//         if (!cinema) {
//             return res.status(404).send({ message: "Cinema not found or you are not authorized to add movies to this cinema." });
//         }

//         const movie = await Movies.create({
//             title,
//             description: description || null,
//             genre,
//             duration,
//             Poster: Poster || null,
//             vendorId: req.user.id,
//             cinemaId, 
//         });

//         res.status(201).send({ message: "Movie added successfully!", movie });
//     } catch (error) {
//         res.status(500).send({ message: "Error: " + error.message });
//     }
// };

// //-----------------update movie----------------------//

// exports.updateMovie = async (req, res) => {
//     const { id } = req.params;
//     const { title, description, genre, duration, Poster, cinemaId } = req.body;

//     if (req.user.role !== 'vendor') {
//         return res.status(403).send({ message: "You are not authorized to update movies." });
//     }

//     try {
//         const movie = await Movies.findByPk(id);

//         if (!movie) {
//             return res.status(404).send({ message: "Movie not found." });
//         }

//         const cinema = await Cinemas.findByPk(movie.cinemaId);

//         if (!cinema || cinema.vendorId !== req.user.id) {
//             return res.status(403).send({ message: "You are not authorized to update this movie." });
//         }

//         if (cinemaId) {
//             const newCinema = await Cinemas.findOne({
//                 where: { id: cinemaId, vendorId: req.user.id },
//             });

//             if (!newCinema) {
//                 return res.status(404).send({
//                     message: "New cinema not found or you are not authorized to update movies in this cinema.",
//                 });
//             }
//         }

//         const updatedData = {};
//         if (title) updatedData.title = title;
//         if (description) updatedData.description = description || null;
//         if (genre) updatedData.genre = genre;
//         if (duration) updatedData.duration = duration;
//         if (Poster) updatedData.Poster = Poster || null;
//         if (cinemaId) updatedData.cinemaId = cinemaId;

//         await movie.update(updatedData);

//         res.status(200).send({ message: "Movie updated successfully!", movie });

//     } catch (error) {
//         res.status(500).send({ message: "Error: " + error.message });
//     }
// };

// //-----------------delete movie----------------------//

// exports.deleteMovie = async (req, res) => {
//     try {
//         if (req.user.role !== 'vendor') {
//             return res.status(403).send({ message: "You are not authorized to delete movies." });
//         }

//         const id = req.params.id;

//         const movie = await Movies.findByPk(id, {
//             include: {
//                 model: Cinemas,
//                 as: 'cinema',
//                 where: { vendorId: req.user.id },
//                 attributes: ['id'], 
//             },
//         });

//         if (!movie) {
//             return res.status(404).send({ message: "Movie not found or you are not authorized to delete it." });
//         }

//         await Movies.destroy({
//             where: { id: id },
//         });

//         res.send({ message: "Movie deleted successfully!" });
//     } catch (error) {
//         res.status(500).send({ message: "Error: " + error.message });
//     }
// };

// //-----------------list movies----------------------//

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
