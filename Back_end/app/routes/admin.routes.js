module.exports = (app) => {
    const adminController = require("../controllers/admin.controller");
    const authMiddleware = require('../controllers/auth.controller');
    var router = require("express").Router();


    router.post('/addvendor',authMiddleware,adminController.addVendor)

    app.use('/api/admin',router)
  };
  