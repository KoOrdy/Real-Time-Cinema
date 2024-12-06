module.exports = (app) => {
  const UserController = require("../controllers/user.controller");
  const authMiddleware = require('../middlewares/auth.controller');
  var router = require("express").Router();


  router.post("/register", UserController.register);

  router.post("/login", UserController.login);

  router.post('/logout', authMiddleware, UserController.logout);

  router.post('/changePassword', authMiddleware, UserController.changePassword);

  router.post('/resetpassword', UserController.resetPassword);

  app.use('/api', router)

};
