module.exports = (app) => {
    const UserController = require("../controllers/user.controller");
    const authMiddleware = require('../controllers/auth.controller');

    app.post("/register", UserController.register);
  
    app.post("/login", UserController.login);

    app.post('/logout', authMiddleware, UserController.logout);

    app.post('/changePassword', authMiddleware, UserController.changePassword);

    app.post('/resetpassword',UserController.resetPassword);
  };
  