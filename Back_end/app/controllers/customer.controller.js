const { Movies, Cinemas, Halls , Users, Bookings, Seats, Showtimes, BookingSeats} = require("../models");
const db = require("../models");
const op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config'); 
const {redisClient, getAsync, setexAsync } = require("../redis/redisClient");
const nodemailer = require('nodemailer');
const emailConfig = require('../config/email.config');
const transporter = nodemailer.createTransport(emailConfig);


exports.viewAvailableCinemas = async (req, res) => {
  try {

    // const cachedCinemas = await getAsync("cinemas");
    // if(cachedCinemas){
    //   return res.status(200).json({ message: "Cinemas fetched successfully.", data: JSON.parse(cachedCinemas)});
    // }

    const cinemas = await Cinemas.findAll();

    if (!cinemas.length) {
      return res.status(404).json({ message: "No cinemas found." });
    }
    // await setexAsync("cinemas", 300, JSON.stringify(cinemas));

    return res.status(200).json({ message: "Cinemas fetched successfully.", data: cinemas });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching cinemas.", data: error.message });
  }
};

exports.viewLastAddedMovies = async (req, res) => {
  try {
    const cinemaID = req.params.cinemaId;
    if (!cinemaID || isNaN(cinemaID)) {
      return res.status(400).json({ message: "Invalid cinema ID." });
    }

    // const cachedLastMovies = await getAsync(`lastMovies for ${cinemaID}`);
    // if(cachedLastMovies){
    //   return res.status(200).json({ message: "Movies fetched successfully", data: JSON.parse(cachedLastMovies) });
    // }

    const movies = await Movies.findAll({
      where : { cinemaId : cinemaID },
      order: [["createdAt", "DESC"]],
      limit: 5,
    });   
    if (!movies.length) {
      return res.status(404).json({ message: "No movies found for this cinema." });
    }
    
    // await setexAsync(`lastMovies for ${cinemaID}`, 300, JSON.stringify(movies));
    return res.status(200).json({ message: "Movies fetched successfully", data: movies });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching movies.", data: error.message });
  }
};

exports.viewAvailableMovies = async (req, res) => {
  try {
    const cinemaID = req.params.cinemaId;
    if (!cinemaID || isNaN(cinemaID)) {
      return res.status(400).json({ message: "Invalid cinema ID." });
    }
    // const cachedMovies = await getAsync(`movies for ${cinemaID}`);
    // if(cachedMovies){
    //   return res.status(200).json({ message: "Movies fetched successfully", data: JSON.parse(cachedMovies) });
    // }

    const movies = await Movies.findAll({ where: { cinemaId : cinemaID } });
    if (!movies.length) {
      return res.status(404).json({ message: "No movies found for this cinema." });
    }
    // await setexAsync(`movies for ${cinemaID}`, 300, JSON.stringify(movies));

    return res.status(200).json({ message: "Movies fetched successfully.", data: movies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching movies.", data: error.message });
  }
};

exports.viewMovieDetails = async (req, res) => {
  try {
    const { movieId, cinemaId } = req.params;
    if (!movieId || isNaN(movieId) || !cinemaId || isNaN(cinemaId)) {
      return res.status(400).json({ message: "Invalid movie ID or cinema ID." });
    }
    
    // const cachedMovie = await getAsync(`movie${movieId} for cinema${cinemaId}`);
    // if(cachedMovie){
    //   return res.status(200).json({ message: "Movie fetched successfully", data: JSON.parse(cachedMovie) });
    // }

    const movie = await Movies.findOne({
      where: {
        id: movieId,
        cinemaId: cinemaId
      },
      include: [
        {
          model: Showtimes,
          as: 'Showtimes',
          attributes: ['date']
        }
      ]
    });
    if(!movie){
      return res.status(404).json({ message: "No movie found for this cinema." });
    }

    // await setexAsync(`movie${movieId} for cinema${cinemaId}` , 300 , JSON.stringify(movie));
    return res.status(200).json({ message: "Movie fetched successfully", data: movie });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching movie:", data: error.message });
  }
};

exports.viewMovieDates = async (req, res) => {
  try {
    const { cinemaId, movieId } = req.params;
    if (!cinemaId || isNaN(cinemaId) || !movieId || isNaN(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID or cinema ID." });
    }
    const movieDates = await Showtimes.findAll({
      where: {
        movieId: movieId,
        cinemaId: cinemaId,
      },
      attributes: ['date'],
    });
    

    if (!movieDates.length) {
      return res.status(404).json({ message: "No dates found for this movie." });
    }

    return res.status(200).json({ message: "Movie dates fetched successfully.", data: movieDates});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching movie dates.", data: error.message });
  }
};

exports.viewMovieShowTimes = async (req, res) => {
  try {
    const { cinemaId, movieId} = req.params;
    const date = req.query.date?.trim();

    if (!cinemaId || isNaN(cinemaId) || !movieId || isNaN(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID or cinema ID." });
    }
    if(!date){
      return res.status(400).json({ message: "Movie Date is required" });
    }
    const movieDate = new Date(date);
    if (!movieDate || isNaN(movieDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }
    const showTimes = await Showtimes.findAll({
      where: {
        movieId,
        cinemaId,
        date,
      },
      attributes: ['id','startTime'],
    });
    

    if (!showTimes.length) {
      return res.status(404).json({ message: "No show times found for this date." });
    }

    return res.status(200).json({ message: "Movie show times fetched successfully.", data: showTimes});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching movie show times.", data: error.message });
  }
};

exports.viewSeatsMap = async (req, res) => {
  try {
    const { showTimeId } = req.params;

    if (!showTimeId || isNaN(showTimeId)) {
      return res.status(400).json({ message: "Invalid show time ID." });
    }

    const showtime = await Showtimes.findOne({
      where: { id: showTimeId },
      attributes: ['hallId'],
    });
    if(!showtime){
      return res.status(404).json({ message: "Show Time not found"});
    }
    const { hallId } = showtime;
    
    const seats = await Seats.findAll({
      where: { hallId: hallId },
      attributes: ['id' , 'seatNum' , 'status'],
    });
    if(!seats.length){
      return res.status(404).json({ message: "No seats found for this show time." });
    }

    const bookedSeats = await Bookings.findAll({
      where: { 
        showtimeId : showTimeId,
        bookingStatus: 'confirmed',
      },
      include: [
        {
          model: BookingSeats,
          as: 'bookingSeats',
          attributes: ['seatId']
        }
      ],
      attributes: []
    })

    return res.status(200).json({
      message: "Seats fetched successfully.",
      data: seats.map(seat => ({
        seatID: seat.id,
        seatName: seat.seatNum,
        seatStatus: seat.status,
      })),
      bookedSeats: bookedSeats
    });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching seats.", data: error.message });
  }
};

exports.searchMoviesByTitle = async (req , res) => {
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
  try {
    const cinemaID = req.params.cinemaId;
    if (!cinemaID || isNaN(cinemaID)) {
      return res.status(400).json({ message: "Invalid cinema ID." });
    }

    const { genre, date } = req.query;
    const filters = { cinemaId: cinemaID };

    if (genre) filters.genre = genre;
    if (date) filters['$Showtimes.date$'] = date;

    const movies = await Movies.findAll({
      where: filters,
      include: [
        {
          model: Showtimes,
          as: 'Showtimes',
          where: date ? { date: date } : {},
          attributes: [], 
        },
      ],
    });
    if (!movies.length) {
      return res.status(404).json({ message: "No movies found with the given filters." });
    }
    return res.status(200).json({ message: "Movies fetched successfully.", data: movies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error filtering for movies", data: error.message });
  }
};

exports.viewMyBookings = async (req , res) => {
  try{
    const customerID = req.user.id;

    const bookings = await Bookings.findAll({ 
      where: { customerId: customerID },
      include:[
        {
          model: Cinemas,
          as: 'cinema',
          attributes: ['name'],
        },
        {
          model: Halls,
          as: 'hall',
          attributes: ['name'],
        },
        {
          model: Movies,
          as: 'movie',
          attributes: ['title'],
        },
        {
          model: Showtimes,
          as: 'showtime',
          attributes: ['date' , 'startTime' , 'endTime'],
        },
        {
          model: BookingSeats,
          as: 'bookingSeats',
          include: [
            {
              model: Seats,
              as: 'seat',
              attributes: ['seatNum'],
            },
          ],
        },
      ],
    });

    if(!bookings.length){
      return res.status(404).json({ message: "No bookings found" });
    }

    return res.status(200).json({
      message: "Bookings fetched successfully.",
      data: bookings.map(booking => ({
        bookingNumber: booking.id,
        cinemaName: booking.cinema.name,
        hallName: booking.hall.name,
        movieName: booking.movie.title,
        startShowTime: booking.showtime.date,
        startShowTime: booking.showtime.startTime,
        endShowTime: booking.showtime.endTime,
        status: booking.bookingStatus,
        seats: booking.bookingSeats.map((seat) => seat.seat.seatNum),
      })),
    });

  }catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error view bookings.", error: error.message });
  };
};

exports.viewUserInfo = async (req , res) => {
  try{
    const customerId = req.user.id;
    const customerInfo = await Users.findOne({
      where: { id : customerId },
      attributes: ['username' , 'email' , 'phone'],
    })
    if(!customerInfo){
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({ message: "User information fetched successfully." , data: customerInfo});
  }catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error returning user information.", error: error.message });
  };
};

exports.updateInfo = async (req , res) => {
  try{
    const customerID = req.user.id;
    const { username , email , phoneNumber} = req.body;
    
    const userUpdateData = {}
    if(username) userUpdateData.username = username;
    if(email) userUpdateData.email = email;
    if(phoneNumber) userUpdateData.phone = phoneNumber;

    if (Object.keys(userUpdateData).length > 0) {
      await Users.update(userUpdateData, { where: { id: customerID } });
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

exports.bookSeat = async (req , res) => {
  const transaction = await db.sequelize.transaction();

  const customerId = req.user.id;
  const { cinemaId , movieId , showtimeId , seatIds , totalPrice} = req.body;

  if (!cinemaId || !movieId || !showtimeId || !totalPrice || !Array.isArray(seatIds) || !seatIds.length) {
    return res.status(400).json({ message: "All fields are required, and seat IDs must be provided!" });
  }   

  try{ 

    const seats = await Seats.findAll({
      where: {
        id: seatIds,
        cinemaId,
        status: 'available', // Only available seats
      },
    });
      
    if (seats.length !== seatIds.length) {
      return res.status(400).json({ message: "Some selected seats are invalid or already booked." });
    }

    await Seats.update(
      { status: "booked" },
      {
        where: { id: seatIds },
        transaction,
      }
    );
    const showtime = await Showtimes.findOne({
      where: { id: showtimeId },
      attributes: ['hallId'],
    })

    const hallId = showtime.hallId;

    const newBooking = await Bookings.create(
      {
        customerId,
        cinemaId,
        movieId,
        hallId,
        showtimeId,
        totalPrice,
        bookingStatus: "confirmed",
        bookingDate: new Date(),
      },
      { transaction },
    );

    const bookedSeats = seatIds.map((seatId) => ({
      bookingId: newBooking.id,
      seatId,
    }));
    await BookingSeats.bulkCreate(bookedSeats, { transaction });

    
    const customerEmail = await Users.findOne({ 
      where: { id: req.user.id },
      attributes: ['email'],
    });
    
    const customerInfo = {
      id: req.user.id,
      name: req.user.username,
      email: customerEmail.email,
    };
    
    await transaction.commit();
    console.log('Transaction committed.');
    await sendEmail({ customer: customerInfo, bookingId: newBooking.id });

    return res.status(201).json({ message: "Booking created successfully." });

  }catch (error) {
    console.error(error);
    if (transaction) await transaction.rollback();
    return res.status(500).json({ message: "Error booking seat", error: error.message });
  };
};

const getData = async ({ bookingId }) => {
  try {
    const data = await Bookings.findOne({
      where: { id: bookingId },
      include: [
        { model: Cinemas, as: 'cinema', attributes: ['name'] },
        { model: Halls, as: 'hall', attributes: ['name'] },
        { model: Movies, as: 'movie', attributes: ['title'] },
        { model: Showtimes, as: 'showtime', attributes: ['date', 'startTime', 'endTime'] },
        { 
          model: BookingSeats, 
          as: 'bookingSeats',
          include: [{ model: Seats, as: 'seat', attributes: ['seatNum'] }],
        },
      ],
    });

    if (!data) {
      console.error(`No booking found for ID: ${bookingId}`);
      return { message: "No data found" };
    }

    // Transforming fetched data into the desired format
    const transformedData = {
      bookingNumber: bookingId,
      cinemaName: data.cinema.name,
      hallName: data.hall.name,
      movieName: data.movie.title,
      movieDate: data.showtime.date,
      showStartTime: data.showtime.startTime,
      showEndTime: data.showtime.endTime,
      status: data.bookingStatus,
      seats: data.bookingSeats.map((seat) => seat.seat.seatNum),
      totalPrice: data.totalPrice,
    };

    return { message: "Data fetched successfully.", data: transformedData };

  } catch (error) {
    console.error('Error fetching data:', error.message);
    return { message: "Error fetching data.", error: error.message };
  }
};

const sendEmail = async ({ customer , bookingId }) => {
  try{
    const result = await getData({ bookingId });
    if (!result.data) {
      throw new Error("Booking data not found");
    }

    const data = result.data;

    const mailOptions = {
      from: emailConfig.auth.user,
      to: customer.email,
      subject: 'Booking is Confirmed',
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">🎥 Your Booking is Confirmed!</h1>
            <p style="margin: 0; font-size: 14px;">Thank you for booking with us!</p>
        </div>

        <!-- Body -->
        <div style="padding: 20px;">
            <p style="font-size: 18px; margin: 0 0 10px;">Dear <strong>${customer.name}😁</strong>,</p>
            <p style="margin: 10px 0;">Thank you for booking with us! We are excited to confirm your booking. Here are your booking details:</p>
            <div style="padding: 15px; background-color: #f9f9f9; border: 1px solid #4CAF50; border-radius: 5px; margin: 10px 0;">
                <p style="margin: 5px 0;"><strong>Booking Number:</strong> ${data.bookingNumber}</p>
                <p style="margin: 5px 0;"><strong>Cinema:</strong> ${data.cinemaName}</p>
                <p style="margin: 5px 0;"><strong>Hall:</strong> ${data.hallName}</p>
                <p style="margin: 5px 0;"><strong>Movie:</strong> ${data.movieName}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${data.movieDate}</p>
                <p style="margin: 5px 0;"><strong>Start Time:</strong> ${data.showStartTime}</p>
                <p style="margin: 5px 0;"><strong>End Time:</strong> ${data.showEndTime}</p>
                <p style="margin: 5px 0;"><strong>Seats:</strong> ${data.seats.join(', ')}</p>
                <p style="margin: 5px 0;"><strong>Total Price:</strong> ${data.totalPrice}</p>
            </div>
            <p style="margin: 20px 0 0;">We look forward to seeing you at the cinema. Thank you for choosing us!</p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f7f7f7; padding: 10px; text-align: center; border-top: 1px solid #ddd;">
            <p style="font-size: 14px; margin: 0; color: #555;">❤ Regards, <br> Your Cinema Team</p>
        </div>
    </div>
</div>

        `
    };

    await transporter.sendMail(mailOptions);

  }catch (error) {
    console.error(error);
    return { message: "Error sending email", error: error.message };
  };
};

exports.cancelBooking = async (req , res) => {

  const transaction = await db.sequelize.transaction();

  try{
    const { bookingId } = req.params;
    const booking = await Bookings.findOne({ where: { id: bookingId } });
    if(!booking){
      return res.status(404).json({ message: "Booking not found." });
    }

    await Bookings.update({ bookingStatus: "cancelled"} , {where : { id: bookingId } , transaction});

    const bookingSeats = await BookingSeats.findAll({
      where: { bookingId },
      attributes: ['seatId'],
      raw: true,
    });

    const seatIds = bookingSeats.map(seat => seat.seatId);

    await Seats.update( { status: "available" } , { where: { id: seatIds } , transaction} );

    await transaction.commit();

    return res.status(200).json({ message: "Booking cancelled successfully" });
  }catch (error) {
    console.error(error);
    if (transaction) await transaction.rollback();
    return res.status(500).json({ message: "Error cancelling booking", error: error.message });
  };
};
