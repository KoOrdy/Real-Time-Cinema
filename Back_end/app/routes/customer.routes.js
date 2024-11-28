module.exports = (app) => {
    const customerController = require("../controllers/customer.controller");
    const authMiddleware = require('../controllers/auth.controller');
    var router = require("express").Router();

    router.get('/cinemas' , authMiddleware, customerController.viewAvailableCinemas);
    router.get('/lastAddedMovies/:cinemaId' , authMiddleware, customerController.viewLastAddedMovies);
    router.get('/movies/:cinemaId' , authMiddleware, customerController.viewAvailableMovies);
    router.get('/movie/:movieId' , authMiddleware, customerController.viewMovieDetails);
    router.get('/BookedSeats/:movieId' , authMiddleware, customerController.viewBookedSeats);

    app.use('/api/customer',router);
  };
  