const db = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = db.users;
const Op = db.Sequelize.Op;

// exports.login=(req,res) => { 
//     const {username, password} = req.body;
//     if(!username || !password) {
//         return resp.status(400).send({message: 'Username and password is required!'})
//     }
//     const existingUser = users.find(user => user.username === username);
//     if(!existingUser) {
//         return resp.status(400).send({message: 'User is not registered!'})
//     }
//     const isValidPassword = await bcrypt.compare(password, existingUser.password);
//     if(!isValidPassword) {
//         return resp.status(400).send({message: 'Password is invalid'})
//     }

//     const token = jwt.sign({username: existingUser.username}, config.secret, {expiresIn: '1h'});
//     resp.send({token});
// }

 