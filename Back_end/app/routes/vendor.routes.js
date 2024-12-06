module.exports = (app) => {
  const vendorController = require("../controllers/vendor.controller");
  const authMiddleware = require('../middlewares/auth.controller');
  const authVendor = require('../middlewares/authVendor');

  var router = require("express").Router();

<<<<<<< HEAD
  router.post('/cinemas/add', authMiddleware, vendorController.addCinema);
  router.put('/cinemas/update/:id', authMiddleware, vendorController.updateCinema);
  router.delete('/cinemas/delete/:id', authMiddleware, vendorController.deleteCinema);
  router.get('/cinemas/', authMiddleware, vendorController.listVendorCinemas);

  router.post('/halls/add', authMiddleware, vendorController.addHall);
  // router.get('/halls/details/:id', authMiddleware, vendorController.getHallDetails);
  // router.get('/halls/:cinemaId', authMiddleware, vendorController.getHallsByCinema);

  // router.post('/movies/add', authMiddleware, vendorController.addMovie);
  // router.put('/movies/update/:id', authMiddleware, vendorController.updateMovie);
  // router.delete('/movies/delete/:id', authMiddleware, vendorController.deleteMovie);
  // router.get('/movies/:cinemaId', authMiddleware, vendorController.viewAvailableMovies);

  // router.post('/showtimes/add', authMiddleware, vendorController.addShowtime);
  // router.put('/showtimes/update/:id', authMiddleware, vendorController.updateShowTime);
  // router.delete('/showtimes/delete/:id', authMiddleware, vendorController.deleteShowtime);
=======
  router.post('/cinemas/add', authMiddleware,authVendor ,vendorController.addCinema);
  router.put('/cinemas/update/:id', authMiddleware ,vendorController.updateCinema);
  router.delete('/cinemas/delete/:id', authMiddleware,authVendor ,vendorController.deleteCinema);
  router.get('/cinemas/', authMiddleware,authVendor ,vendorController.viewAvailableCinemas);

  router.post('/movies/add', authMiddleware,authVendor, vendorController.addMovie);
  router.put('/movies/update/:id', authMiddleware,authVendor, vendorController.updateMovie);
  router.delete('/movies/delete/:id', authMiddleware,authVendor, vendorController.deleteMovie);
  router.get('/movies/:cinemaId', authMiddleware,authVendor, vendorController.viewAvailableMovies);


  router.post('/halls/add', authMiddleware,authVendor, vendorController.addHall);
  router.get('/halls/:cinemaId', authMiddleware, vendorController.getHallsByCinema);

  router.post('/showtimes/add', authMiddleware,authVendor, vendorController.addShowtime);
  router.put('/showtimes/update/:id', authMiddleware,authVendor, vendorController.updateShowTime);
  router.delete('/showtimes/delete/:id', authMiddleware,authVendor, vendorController.deleteShowtime);
>>>>>>> cc4745917686343bb0fcc4d9780a17cb6c561dc7
  app.use('/api/vendor', router);
};
