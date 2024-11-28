module.exports = (app) => {
  const vendorController = require("../controllers/vendor.controller");
  const authMiddleware = require('../controllers/auth.controller');

  var router = require("express").Router();

  router.post('/cinemas/add', authMiddleware, vendorController.addCinema);
  router.put('/cinemas/update/:id', authMiddleware, vendorController.updateCinema);
  router.delete('/cinemas/delete/:id', authMiddleware, vendorController.deleteCinema);
  router.get('/cinemas/', authMiddleware, vendorController.viewAvailableCinemas);

  router.post('/movies/add', authMiddleware, vendorController.addMovie);
  router.put('/movies/update/:id', authMiddleware, vendorController.updateMovie);
  router.delete('/movies/delete/:id', authMiddleware, vendorController.deleteMovie);
  router.get('/movies/:cinemaId', authMiddleware, vendorController.viewAvailableMovies);
  app.use('/api/vendor', router);
};
