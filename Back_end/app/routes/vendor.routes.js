module.exports = (app) => {
  const vendorController = require("../controllers/vendor.controller");
  const authMiddleware = require('../controllers/auth.controller');

  var router = require("express").Router();

  router.post('/cinemas/add', authMiddleware, vendorController.addCinema);
  router.put('/cinemas/update/:id', authMiddleware, vendorController.updateCinema);


  app.use('/api/vendor', router);
};
