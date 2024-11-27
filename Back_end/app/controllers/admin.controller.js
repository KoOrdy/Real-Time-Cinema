const db = require("../models");
const bcrypt = require('bcrypt');
const User = db.Users;
const Op = db.Sequelize.Op;

exports.addVendor = async (req,res) =>{
    if (req.user.role !== 'admin') {
        return res.status(403).send({ message: "You are not authorized to add vendors." });
    }
    
    const { username, email, password } = req.body;

    if(!username || !email || !password){
        return res.status(400).send({message: "All fields are required!"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    User.create({
        username: username,
        email: email,
        password: hashedPassword,
        role: "vendor"
    })

    .then((Vendor) => {
        res.status(201).send({ message: "Vendor Created successfully!", Vendor });
    })
    .catch((error) => {
        res.status(500).send({ message: "Error: " + error.message });
    });
}

exports.deleteVendor = (req, res) => {
    if (req.user.role!== 'admin') {
        return res.status(403).send({ message: "You are not authorized to delete vendors." });
    }
    
    const id = req.params.id;
    User.destroy({
        where: { id: id ,  role: {
            [Op.or]: ['vendor', 'customer']
        } },
    })

    .then((num) => {
        if (num === 0) {
            res.status(404).send({ message: "user not found." });
        } else {
            res.send({ message: `${num} user deleted successfully!` });
        }
    })
    .catch((error) => {
        res.status(500).send({ message: "Error: " + error.message });
    });
}

