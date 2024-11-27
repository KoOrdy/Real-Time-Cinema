const db = require("../models");
const Cinema = db.Cinemas;

exports.addCinema = async (req, res) => {

    if (req.user.role !== 'vendor') {
        return res.status(403).send({ message: "You are not authorized to add cinemas." });
    }

    const { name, location, contactInfo } = req.body;

    if (!name || !location || !contactInfo) {
        return res.status(400).send({ message: "All fields are required!" });
    }

    try {
        const cinema = await Cinema.create({
            name,
            location,
            contactInfo,
            vendorId: req.user.id,
        });

        res.status(201).send({ message: "Cinema added successfully!", cinema });
    } catch (error) {
        res.status(500).send({ message: "Error: " + error.message });
    }
};
