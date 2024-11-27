const db = require("../models");
const Cinema = db.Cinemas;

exports.addCinema = async (req, res) => {
    const { name, location, contactInfo, vendorId } = req.body;

    if (!['vendor', 'admin'].includes(req.user.role)) {
        return res.status(403).send({ message: "You are not authorized to add cinemas." });
    }

    if (!name || !location || !contactInfo) {
        return res.status(400).send({ message: "All fields are required!" });
    }

    if (req.user.role === 'admin' && !vendorId) {
        return res.status(400).send({ message: "Vendor ID is required." });
    }

    try {
        if (req.user.role === 'admin') {
            const vendor = await db.Users.findOne({ where: { id: vendorId, role: 'vendor' } });
            if (!vendor) {
                return res.status(404).send({ message: "Vendor not found." });
            }
        }

        const cinema = await Cinema.create({
            name,
            location,
            contactInfo,
            vendorId: req.user.role === 'vendor' ? req.user.id : vendorId,
        });

        res.status(201).send({ message: "Cinema added successfully!", cinema });
    } catch (error) {
        res.status(500).send({ message: "Error: " + error.message });
    }
};
