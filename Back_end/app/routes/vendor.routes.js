module.exports = (app) => {
  const vendorController = require("../controllers/vendor.controller");
  const authMiddleware = require('../middlewares/auth.controller');
  const authVendor = require('../middlewares/authVendor');

  var router = require("express").Router();

  router.post('/cinemas/add', authMiddleware, authVendor, vendorController.addCinema);
  router.put('/cinemas/update/:id', authMiddleware, vendorController.updateCinema);
  router.delete('/cinemas/delete/:id', authMiddleware, authVendor, vendorController.deleteCinema);
  router.get('/cinemas/', authMiddleware, authVendor, vendorController.listVendorCinemas);

  router.post('/halls/add', authMiddleware, authVendor, vendorController.addHall);
  // router.get('/halls/details/:id', authMiddleware, authVendor, vendorController.getHallDetails);
  // router.get('/halls/:cinemaId', authMiddleware, authVendor, vendorController.getHallsByCinema);

  // router.post('/movies/add', authMiddleware, authVendor, vendorController.addMovie);
  // router.put('/movies/update/:id', authMiddleware, authVendor, vendorController.updateMovie);
  // router.delete('/movies/delete/:id', authMiddleware, authVendor, vendorController.deleteMovie);
  // router.get('/movies/:cinemaId', authMiddleware, authVendor, vendorController.viewAvailableMovies);

  // router.post('/showtimes/add', authMiddleware, authVendor, vendorController.addShowtime);
  // router.put('/showtimes/update/:id', authMiddleware, authVendor, vendorController.updateShowTime);
  // router.delete('/showtimes/delete/:id', authMiddleware, authVendor, vendorController.deleteShowtime);
  app.use('/api/vendor', router);
};
