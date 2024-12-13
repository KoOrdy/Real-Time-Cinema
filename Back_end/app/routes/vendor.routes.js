module.exports = (app) => {
  const vendorController = require("../controllers/vendor.controller");
  const authMiddleware = require('../middlewares/auth.controller');
  const authVendor = require('../middlewares/authVendor');

  var router = require("express").Router();

  router.post('/cinemas/add', authMiddleware, authVendor, vendorController.addCinema);
  router.put('/cinemas/update/:id', authMiddleware, vendorController.updateCinema);
  router.delete('/cinemas/delete/:id', authMiddleware, authVendor, vendorController.deleteCinema);
  router.get('/cinemas/', authMiddleware, authVendor, vendorController.listVendorCinemas);

  router.post('/:cinemaId/addhalls', authMiddleware, authVendor, vendorController.addHall); //cinemaId(2)/addhalls
  router.get('/:cinemaId/halls', authMiddleware, authVendor, vendorController.listCinemaHalls); //cinemaId(2)/halls

  router.post('/:cinemaId/addmovies', authMiddleware, authVendor, vendorController.addMovie);
  router.put('/:cinemaId/updatemovies/:movieId', authMiddleware, authVendor, vendorController.updateMovie);
  router.delete('/:cinemaId/deletemovies/:movieId', authMiddleware, authVendor, vendorController.deleteMovie);
  router.get('/:cinemaId/movies', authMiddleware, authVendor, vendorController.viewAvailableMovies);

  router.post('/:cinemaId/addShowtime', authMiddleware, authVendor, vendorController.addShowtime); //cinemaID(1)/addShowtime <- 
  router.put('/:cinemaId/updateShowtime/:id', authMiddleware, authVendor, vendorController.updateShowTime); //cinemaID(1)/updateShowtime/id's showtime(1) <-
  router.get('/:hallId/showtimes', authMiddleware, authVendor, vendorController.listHallShowtimes);
  router.delete('/:cinemaId/deleteShowtime/:id', authMiddleware, authVendor, vendorController.deleteShowtime);
  app.use('/api/vendor', router);
};
