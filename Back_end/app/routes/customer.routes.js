module.exports = (app) => {
  const customerController = require("../controllers/customer.controller");
  const authMiddleware = require('../middlewares/auth.controller');
  var router = require("express").Router();

  router.get('/cinemas', authMiddleware, customerController.viewAvailableCinemas);

  router.get('/lastAddedMovies/:cinemaId', authMiddleware, customerController.viewLastAddedMovies);
  router.get('/movies/:cinemaId', authMiddleware, customerController.viewAvailableMovies);

  router.get('/cinema/:cinemaId/movies/search', authMiddleware, customerController.searchMoviesByTitle); // GET /cinemas/1/movies/search?title=Avengers
  router.get('/cinema/:cinemaId/movies/filter', authMiddleware, customerController.filterMovies); // GET /api/customer/cinema/:cinemaId/movies/filter?genre=action&date=2024-01-01

  router.get('/cinemas/:cinemaId/movie/:movieId', authMiddleware, customerController.viewMovieDetails);
  router.get('/cinema/:cinemaId/movie/:movieId/bookedSeats', authMiddleware, customerController.viewBookedSeats);

  router.get('/bookings', authMiddleware, customerController.viewMyBookings);

  // router.post('/bookings' , authMiddleware, customerController.bookSeats);

  router.patch('/updateInfo', authMiddleware, customerController.updateInfo);



  app.use('/api/customer', router);
};
