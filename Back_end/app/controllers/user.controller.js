const authMiddleware = require('../middlewares/auth.controller');
const config = require('../config/auth.config');
const db = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../middlewares/tokenblacklist');
const nodemailer = require('nodemailer');
const emailConfig = require('../config/email.config');
const transporter = nodemailer.createTransport(emailConfig);
const crypto = require('crypto');
const User = db.Users;
const Op = db.Sequelize.Op;


function RandomPass(length = 12) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

exports.register = async (req, res) => {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
        return res.status(400).send({ message: "All fields are required!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    User.create({
        username: username,
        email: email,
        password: hashedPassword,
        phone: phone,
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
        { id: existingUser.id, username: existingUser.username, role: existingUser.role },
        config.secret,
        { expiresIn: '20h' }
    );
    res.status(200).send({ token,role:existingUser.role });

};

exports.logout = (req, res) => {
    const header = req.header('Authorization');
    if (!header) {
        return res.status(401).send({ message: 'Access denied, no token provided' });
    }

    const token = header.replace('Bearer ', '');
    tokenBlacklist.addToken(token);
    return res.status(200).send({ message: 'User logged out successfully.' });
};


exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!oldPassword || !newPassword) {
        return res.status(400).send({ message: 'All fields are required!' });
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
        return res.status(401).send({ message: 'Invalid The old password!' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();


    return res.status(200).send({ message: 'password changed successfully' })
}


exports.resetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newPassword = RandomPass();

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.update({ password: hashedPassword }, { where: { email } });

        const mailOptions = {
            from: emailConfig.auth.user,
            to: email,
            subject: 'Password Reset Notification',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <div style="background-color: #f7f7f7; padding: 20px; text-align: center; border-bottom: 1px solid #ddd;">
                            <h1 style="color: #4CAF50; margin: 0;">Password Reset</h1>
                            <p style="margin: 5px 0 0;">Notification</p>
                        </div>
                        <div style="padding: 20px;">
                            <p style="font-size: 18px; margin: 0 0 10px;">Hey <strong>${user.username}</strong> 😁,</p>
                            <p style="margin: 10px 0;">Your password has been reset successfully.</p>
                            <div style="padding: 15px; background-color: #f9f9f9; border: 1px dashed #4CAF50; border-radius: 5px; text-align: center;">
                                <p style="font-size: 18px; margin: 0;">Your new password is:</p>
                                <p style="font-size: 20px; font-weight: bold; color: #4CAF50; margin: 10px 0;">${newPassword}</p>
                            </div>
                            <p style="margin: 20px 0 0;">Please keep it secure! 🫵</p>
                        </div>
                        <div style="background-color: #f7f7f7; padding: 10px; text-align: center; border-top: 1px solid #ddd;">
                            <p style="font-size: 14px; margin: 0; color: #777;">If you have any questions, feel free to contact our support team.</p>
                        </div>
                    </div>
                </div>
            `
        };
        

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset successfully and email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error });
    }
};
