module.exports = (app) => {
    const UserController = require("../controllers/user.controller");
  
    app.post("/register", UserController.register);
  
    app.post("/login", UserController.login);
  };
  