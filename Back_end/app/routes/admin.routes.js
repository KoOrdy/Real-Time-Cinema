module.exports = (app) => {
    const adminController = require("../controllers/admin.controller");
    const authMiddleware = require('../controllers/auth.controller');
    var router = require("express").Router();


    router.post('/',authMiddleware,adminController.addVendor)
    router.delete('/:id', authMiddleware, adminController.deleteUser);
    router.get('/vendor', authMiddleware, adminController.listVendors);
    router.get('/customer', authMiddleware, adminController.listCustomer);

    app.use('/api/admin',router)
  };
  