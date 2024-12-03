const db = require("../models");
const bcrypt = require('bcrypt');
const User = db.Users;
const Movies = db.Movies;
const Cinemas = db.Cinemas;
const Bookings = db.Bookings;
const Reports = db.Reports;
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

exports.deleteUser = (req, res) => {
    if (req.user.role!== 'admin') {
        return res.status(403).send({ message: "You are not authorized to delete." });
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

exports.listVendors = (req, res) => {
    if (req.user.role!== 'admin') {
        return res.status(403).send({ message: "You are not authorized to list Vendors." });
    }

    User.findAll({
        where: { role: 'vendor' },
        attributes: ['id', 'username', 'email']
    })
   .then((vendors) => {
    res.send(vendors);
    }).catch((error) => {
        res.status(500).send({ message: "Error: " + error.message });
    });
}
exports.listCustomer = (req, res) => {
    if (req.user.role!== 'admin') {
        return res.status(403).send({ message: "You are not authorized to List Customers." });
    }

    User.findAll({
        where: { role: 'customer' },
        attributes: ['id', 'username', 'email']
    })
   .then((customer) => {
    res.send(customer);
    }).catch((error) => {
        res.status(500).send({ message: "Error: " + error.message });
    });
}

exports.viewMovies = (req, res) => {

    Movies.findAll({
        attributes: ['id', 'title', 'description', 'releaseDate', 'duration', 'Poster']
    })
   .then((movies) => {
    return res.send(movies);
   }).catch((error) => {
    res.status(500).send({message: "Error: " + error.message})
   });

}

exports.viewAvailableMovies = async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "You are nor authorized to view movies." });
    }
    try {
      const cinemaID = req.params.cinemaId;
      const movies = await Movies.findAll({
        include: [
          {
            model: Cinemas,
            as: "cinemas",
            where: { id: cinemaID },
            required: true,
            attributes: [],
          },
        ],
      });
      if (!movies || !movies.length) {
        return res.status(404).json({ message: "No movies found for this cinema." });
      }
      return res.status(200).json({ message: "Movies fetched successfully", data: movies });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching movies:", data: error.message });
    }
  };

  exports.reports = async (req, res) => {  
    try{  
        const users = await  User.findAll(); 
        const cinemas = await  Cinemas.findAll();
        const bookings = await  Bookings.findAll();
        const now = new Date(); 
        const today = now.toISOString().split("T")[0];
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000); 

        let countusers = 0;
        let countcinemas = 0;
        countbookings = bookings.length; 

        for (let i = 0; i < users.length; i++) {
            const user = users[i]; 

            if (user.role === "customer") { 
                if (user.createdAt && new Date(user.createdAt) > last24Hours) {     
                    countusers++;
                }
            }  
        }

        for (let j = 0; j < cinemas.length; j++) {
            const cinema = cinemas[j];
            if (cinema.createdAt && new Date(cinema.createdAt) > last24Hours) {
                countcinemas++;
            }
        }

        const existingReport = await Reports.findOne({ where: { reportDate: today } });
            if (existingReport) {
                return res.status(200).send({
                    message: "A report for today already exists.",
                    report: existingReport,
                });
            }

        const newReports = await Reports.create({
            reportDate : today,
            newCustomers : countusers,
            newCinemas : countcinemas,
            totalBookings : countbookings
        });

        res.status(200).send({ 
            message: "report generate successfully",
            report : newReports
        });    } catch (error) {
        res.status(500).send({ message: "Error: " + error.message });
    }
};

  