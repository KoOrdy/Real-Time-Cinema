const { Movies, Cinemas, Halls , Users, UserDetails, Bookings, Seats, Showtimes, Notifications,} = require("../models");
const db = require("../models");
const op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config'); 


exports.viewAvailableCinemas = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "You are not authorized to view cinemas." });
  }
  try {
    const cinemas = await Cinemas.findAll();

    if (!cinemas.length) {
      return res.status(404).json({ message: "No cinemas found." });
    }
    return res.status(200).json({ message: "Cinemas fetched successfully.", data: cinemas });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching cinemas.", data: error.message });
  }
};

exports.viewLastAddedMovies = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "You are not authorized to view movies." });
  }
  try {
    const cinemaID = req.params.cinemaId;
    if (!cinemaID || isNaN(cinemaID)) {
      return res.status(400).json({ message: "Invalid cinema ID." });
    }
    const movies = await Movies.findAll({
      where : { cinemaId : cinemaID },
      attributes: ["id", "Poster", "title", "description", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    if (!movies.length) {
      return res.status(404).json({ message: "No movies found for this cinema." });
    }

    return res.status(200).json({ message: "Movies fetched successfully", data: movies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching movies.", data: error.message });
  }
};

exports.viewAvailableMovies = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "You are nor authorized to view movies." });
  }
  try {
    const cinemaID = req.params.cinemaId;
    if (!cinemaID || isNaN(cinemaID)) {
      return res.status(400).json({ message: "Invalid cinema ID." });
    }
    const movies = await Movies.findAll({ where: { cinemaId : cinemaID } });
    if (!movies.length) {
      return res.status(404).json({ message: "No movies found for this cinema." });
    }
    return res.status(200).json({ message: "Movies fetched successfully.", data: movies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching movies.", data: error.message });
  }
};

// exports.viewAvailableMovies = async (req, res) => {
//   if (req.user.role !== "customer") {
//     return res.status(403).json({ message: "You are not authorized to view movies." });
//   }

//   try {
//     const cinemaID = req.params.cinemaId;
//     const cinema = await Cinemas.findByPk(cinemaID, {
//       include: {
//         model: Movies,
//         as: "movies", 
//         through: { attributes: [] }, 
//       },
//     });

//     if (!cinema) {
//       return res.status(404).json({ message: "Cinema not found." });
//     }
//     if (!cinema.movies || !cinema.movies.length) {
//       return res.status(404).json({ message: "No movies found for this cinema." });
//     }

//     return res.status(200).json({ message: "Movies fetched successfully", data: cinema.movies });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error fetching movies:", data: error.message });
//   }
// };


exports.viewMovieDetails = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "You are not authorized to view movies." });
  }

  const { movieId, cinemaId } = req.params;
  if (!movieId || isNaN(movieId) || !cinemaId || isNaN(cinemaId)) {
    return res.status(400).json({ message: "Invalid movie ID or cinema ID." });
  }
  try {
    const movie = await Movies.findOne({
      where: { 
        id: movieId ,
        cinemaId: cinemaId,
      },
      attributes: ['id' , 'title' , 'description' , 'genre', 'duration' , 'Poster' , 'cinemaId'],
      include: [
        {
          model: Cinemas,
          as: 'cinema',
          attributes: ['name'],
        },
        {
          model: Showtimes,
          as: 'showtimes', 
          where: { cinemaId },
          attributes: ['startTime', 'date', 'hallId'],
          include: [
            {
              model: Halls,
              as: 'hall',
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    if (!movie) {
      return res.status(404).json({ message: "No movie found for this cinema." });
    }

    const movieDetails = {
      movieName: movie.title,
      movieDescription: movie.description,
      movieGenre: movie.genre,
      movieDuration: movie.duration,
      moviePoster: movie.Poster,
      cinemas: [{
        cinemaName: movie.cinema.name,
        showtimes: movie.showtimes.map(showtime => ({
          startTime: showtime.startTime,
          date: showtime.date,
          hallName: showtime.hall ? showtime.hall.name : 'No Hall', 
        })),
      }],
    };

    return res.status(200).json({ message: "Movie details fetched successfully.", data: movieDetails, });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching movie details.", data: error.message });
  }
};

exports.viewBookedSeats = async (req, res) => {
  if (req.user.role !== "customer") {
      return res.status(403).json({ message: "You are not authorized to view booked seats." });
  }

  try {
      const movieID = req.params.movieId;
      const cinemaID = req.params.cinemaId; // Get cinemaId from the request

      // Validate movieId and cinemaId
      if (!movieID || isNaN(movieID)) {
          return res.status(404).json({ message: "Invalid movie ID." });
      }
      if (!cinemaID || isNaN(cinemaID)) {
          return res.status(404).json({ message: "Invalid cinema ID." });
      }

      // Find bookings based on both movieId and cinemaId
      const BookedSeats = await Bookings.findAll({ 
          where: { movieId: movieID, cinemaId: cinemaID } 
      });

      if (!BookedSeats.length) {
          return res.status(404).json({ message: "No bookings found for this movie." });
      }

      const seatIds = BookedSeats.map(booking => booking.seats).flat(); 
      const seats = await Seats.findAll({
          where: { id: seatIds },
          attributes: ['name', 'status'],
      });

      return res.status(200).json({
          message: "Seats fetched successfully.",
          data: seats.map(seat => ({
              seatName: seat.name,
              seatStatus: seat.status,
          })),
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching seats.", data: error.message });
  }
};

exports.searchMoviesByTitle = async (req , res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "You are not authorized to view movies." });
  }

  try{
    const cinemaID = req.params.cinemaId;
    if(!cinemaID || isNaN(cinemaID)){
      return res.status(400).json({ message: "Invalid cinema ID." });
    }
    const movieTitle = req.query.title?.trim();
    if(!movieTitle){
      return res.status(400).json({ message: "Please provide a movie title to search for." });
    }
    const movies = await Movies.findAll({
      where: { 
        cinemaId : cinemaID,
        title: {[op.iLike] : `%${movieTitle}%`},
       },      
    });
    if (!movies.length) {
      return res.status(404).json({ message: "No movies found with this title." });
    }
      
      return res.status(200).json({ message: "Movies fetched successfully", data: movies });
  }catch (error) {
   console.error(error);
   return res.status(500).json({ message: "Error searching for movies", data: error.message });
  };
};

exports.filterMovies = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "You are not authorized to view movies." });
  }

  try {
    const cinemaID = req.params.cinemaId;
    if (!cinemaID || isNaN(cinemaID)) {
      return res.status(400).json({ message: "Invalid cinema ID." });
    }

    const { genre, date } = req.query;
    const filters = { cinemaId: cinemaID };

    if (genre) filters.genre = genre;
    if (date) filters['$showtimes.date$'] = date;

    const movies = await Movies.findAll({
      where: filters,
      include: [
        {
          model: Showtimes,
          as: 'showtimes',
          attributes: ['date'], 
        },
      ],
    });
    if (movies.length === 0) {
      return res.status(404).json({ message: "No movies found with the given filters." });
    }
    return res.status(200).json({ message: "Movies fetched successfully.", data: movies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error filtering for movies", data: error.message });
  }
};

// exports.bookSeats = async (req, res) => {
//   const { customerId, cinemaId, hallId, showtimeId, movieId, seatIds } = req.body;

//   // Validate input
//   if (!seatIds || seatIds.length === 0) {
//     return res.status(400).json({ message: "You must specify at least one seat to book." });
//   }

//   try {
//     // Check if the seats are valid and available
//     const seats = await sequelize.models.Seats.findAll({
//       where: {
//         id: seatIds,
//         hallId,
//         cinemaId,
//         status: 'available', // Only available seats
//       },
//     });

//     if (seats.length !== seatIds.length) {
//       return res.status(400).json({ message: "Some selected seats are invalid or already booked." });
//     }

//     // Update seats to "booked"
//     await sequelize.models.Seats.update(
//       { status: 'booked' },
//       { where: { id: seatIds } }
//     );

//     // Create booking
//     const booking = await sequelize.models.Bookings.create({
//       customerId,
//       cinemaId,
//       hallId,
//       showtimeId,
//       movieId,
//       seats: seatIds, // Save seat IDs in booking
//       status: 'booked',
//     });

//     return res.status(201).json({ message: "Booking successful!", data: booking });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error creating booking.", error: error.message });
//   }
// };



// exports.cancelBooking = async (req, res) => {
//   const { bookingId } = req.params;

//   try {
//     const booking = await sequelize.models.Bookings.findByPk(bookingId);

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found." });
//     }

//     // Update seat statuses back to "available"
//     await sequelize.models.Seats.update(
//       { status: 'available' },
//       { where: { id: booking.seats } }
//     );

//     // Update booking status to "canceled"
//     booking.status = 'canceled';
//     await booking.save();

//     return res.status(200).json({ message: "Booking canceled successfully!", data: booking });
//   }catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error canceling booking.", error: error.message });
//   };
// };

exports.viewMyBookings = async (req , res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "You are not authorized to view bookings." });
  }

  try{
    const customerID = req.user.id;

    const bookings = await Bookings.findAll({ 
      where: { customerId: customerID },
      include: [
        {
          model: Cinemas,
          as:'cinema',
          attributes: ['name'],
        },
        {
          model: Halls,
          as: 'hall',
          attributes: ['name']
        },
        {
          model: Movies,
          as: 'movie',
          attributes: ['title'],
        },
        {
          model: Showtimes,
          as: 'showtime',
          attributes: ['startTime' , 'endTime'],
        }
      ]
    });
    if(!bookings.length){
      return res.status(404).json({ message: "No bookings found" });
    }

    return res.status(200).json({
      message: "Bookings fetched successfully.",
      data: bookings.map(booking => ({
        id: booking.id,
        cinemaName: booking.cinema.name,
        hallName: booking.hall.name,
        movieName: booking.movie.title,
        startShowTime: booking.showtime.startTime,
        endShowTime: booking.showtime.endTime,
        seats: booking.seats,
        status: booking.status,
      })),
    });

  }catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error view bookings.", error: error.message });
  };
};

exports.updateInfo = async (req , res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "You are not authorized to update information." });
  }

  try{
    const customerID = req.user.id;
    const { username , email , phoneNumber , address , profilePicture} = req.body;
    
    const userUpdateData = {}
    if(username) userUpdateData.username = username;
    if(email) userUpdateData.email = email;

    const userDetailsUpdateData = {};
    if(phoneNumber) userDetailsUpdateData.phoneNumber = phoneNumber;
    if(address) userDetailsUpdateData.address = address;
    if (profilePicture !== undefined) userDetailsUpdateData.profilePicture = profilePicture;

    if (Object.keys(userUpdateData).length > 0) {
      await Users.update(userUpdateData, { where: { id: customerID } });
    }
    if (Object.keys(userDetailsUpdateData).length > 0) {
      await UserDetails.update(userDetailsUpdateData, { where: { userId: customerID } });
    }

    const updatedUsername = username || req.user.username;
    const token = jwt.sign(
      { id: customerID, username: updatedUsername ,role: 'customer'}, 
      config.secret, 
      { expiresIn: '1h' }
    );
    return res.status(200).json({ message: "Information updated successfully." , token: token})

  }catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating user information.", error: error.message });
  };
};


