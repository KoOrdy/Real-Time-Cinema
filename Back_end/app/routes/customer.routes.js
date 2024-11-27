module.exports = (app) => {
    const customerController = require("../controllers/customer.controller");
    const authMiddleware = require('../controllers/auth.controller');
    var router = require("express").Router();

    router.get('/lastAddedMovies/:cinemaId' , authMiddleware, customerController.viewLastAddedMovies);

    app.use('/api/customer',router);
  };
  