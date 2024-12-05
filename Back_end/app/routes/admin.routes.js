module.exports = (app) => {
  const adminController = require("../controllers/admin.controller");
  const authMiddleware = require('../middlewares/auth.controller');
  const authAdmin = require('../middlewares/authAdmin');
  var router = require("express").Router();


  router.post('/', authMiddleware, authAdmin, adminController.addVendor)
  router.delete('/:id', authMiddleware, authAdmin, adminController.deleteUser);
  router.get('/vendor', authMiddleware, authAdmin, adminController.listVendors);
  router.get('/customer', authMiddleware, authAdmin, adminController.listCustomer);
  router.get('/movies/:cinemaId', authMiddleware, authAdmin, adminController.viewAvailableMovies);
  router.get('/reports', authMiddleware, authAdmin, adminController.reports);


  app.use('/api/admin', router)
};
