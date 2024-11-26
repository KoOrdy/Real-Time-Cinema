const authMiddleware = require('./auth.controller');
const config = require('../config/db.config'); 
const db = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = db.users;
const Op = db.Sequelize.Op;

exports.register = async (req, res) => {
    const { username, email, password} = req.body;

    if (!username || !email || !password) {
        return res.status(400).send({ message: "All fields are required!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    User.create({
        username: username,
        email: email,
        password: hashedPassword,
        role: "customer"
    })
    .then((user) => {
        res.status(201).send({ message: "User registered successfully!", user });
    })
    .catch((error) => {
        res.status(500).send({ message: "Error: " + error.message });
    });
};


exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ message: 'Username and password are required!' });
    }

    
        const existingUser = await User.findOne({ where: { username } });
        if (!existingUser) {
            return res.status(404).send({ message: 'User not found!' });
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return res.status(401).send({ message: 'Invalid password!' });
        }

        const token = jwt.sign(
            { id: existingUser.id, username: existingUser.username }, 
            config.secret, 
            { expiresIn: '1h' }
        );
         res.status(200).send({ token });

};


