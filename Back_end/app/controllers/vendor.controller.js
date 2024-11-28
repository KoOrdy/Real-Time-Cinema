const db = require("../models");
const cinemas = require("../models/cinemas");
const Cinema = db.Cinemas;
const Hall = db.Halls;
exports.addCinema = async (req, res) => {
    const { name, location, contactInfo } = req.body;

    if (req.user.role !== 'vendor') {
        return res.status(403).send({ message: "You are not authorized to add cinemas." });
    }

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

exports.updateCinema = async (req, res) => {
    const { id } = req.params;
    const { name, location, contactInfo } = req.body;

    if (!['vendor', 'admin'].includes(req.user.role)) {
        return res.status(403).send({ message: "You are not authorized to update cinemas." });
    }

    try {
        const cinema = await Cinema.findByPk(id);
        
        if (!cinema) {
            return res.status(404).send({ message: "Cinema not found." });
        }

        if (req.user.role === 'vendor' && cinema.vendorId !== req.user.id) {
            return res.status(403).send({ message: "You are not authorized to update this cinema." });
        }

        const updatedData = {};
        if (name) updatedData.name = name;
        if (location) updatedData.location = location;
        if (contactInfo) updatedData.contactInfo = contactInfo;

        await cinema.update(updatedData);
        res.status(200).send({ message: "Cinema updated successfully!", cinema });

    } catch (error) {
        res.status(500).send({ message: "Error: " + error.message });
    }
};

exports.deleteCinema = async (req, res) => {
    try {
        if (req.user.role !== 'vendor') {
            return res.status(403).send({ message: "You are not authorized to delete cinemas." });
        }

        const id = req.params.id;

        const cinema = await Cinema.findOne({
            where: { id: id, vendorId: req.user.id },
        });

        if (!cinema) {
            return res.status(404).send({ message: "Cinema not found or you do not have access to delete it." });
        }

        await Cinema.destroy({
            where: { id: id },
        });

        res.send({ message: "Cinema deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: "Error: " + error.message });
    }
};

exports.viewAvailableCinemas = async (req, res) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "You are not authorized to view cinemas." });
  }

  try {
    const vendorId = req.user.id; 
    const cinemas = await Cinema.findAll({ where: { vendorId } });

    if (!cinemas || cinemas.length === 0) {
      return res.status(404).json({ message: "No cinemas found for this vendor." });
    }

    return res.status(200).json({ message: "Cinemas fetched successfully.", data: cinemas });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching cinemas.", error: error.message });
  }
};
