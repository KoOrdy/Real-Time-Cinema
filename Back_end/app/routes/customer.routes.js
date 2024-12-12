module.exports = (app) => {
  const customerController = require("../controllers/customer.controller");
  const authMiddleware = require('../middlewares/auth.controller');
  const authCustomer = require('../middlewares/authCustomer');
  var router = require("express").Router();

  router.get('/cinemas', authMiddleware, authCustomer , customerController.viewAvailableCinemas);

  router.get('/lastAddedMovies/:cinemaId', authMiddleware, authCustomer, customerController.viewLastAddedMovies);
  router.get('/movies/:cinemaId', authMiddleware, authCustomer , customerController.viewAvailableMovies);

  router.get('/cinema/:cinemaId/movies/search', authMiddleware, authCustomer , customerController.searchMoviesByTitle); // GET /cinema/1/movies/search?title=Avengers
  router.get('/cinema/:cinemaId/movies/filter', authMiddleware, authCustomer , customerController.filterMovies); // GET /api/customer/cinema/:cinemaId/movies/filter?genre=action&date=2024-01-01

  router.get('/cinemas/:cinemaId/movie/:movieId', authMiddleware, authCustomer , customerController.viewMovieDetails);
  router.get('/cinemas/:cinemaId/movie/:movieId/dates', authMiddleware, authCustomer , customerController.viewMovieDates);
  router.get('/cinemas/:cinemaId/movie/:movieId/showTimes', authMiddleware, authCustomer , customerController.viewMovieShowTimes); // GET /cinemas/:cinemaId/movie/:movieId/showTimes?date=2024-12-15


  router.get('/showTimeId/:showTimeId/seats', authMiddleware, authCustomer , customerController.viewSeatsMap);

  router.get('/myBookings', authMiddleware, authCustomer , customerController.viewMyBookings);

  // router.post('/bookings' , authMiddleware, customerController.bookSeats);

  router.patch('/updateInfo', authMiddleware, authCustomer , customerController.updateInfo);



  app.use('/api/customer', router);
};
