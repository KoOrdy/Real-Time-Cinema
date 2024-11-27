const db = require("../models");
const Users = db.Users;
const UserDetails = db.UserDetails;
const Movies = db.Movies;
const Cinemas = db.Cinemas;
// const Halls = db.Halls;
const Bookings = db.Bookings;
const Seats = db.Seats;
const Showtimes = db.Showtimes;
const Notifications = db.Notifications;


const viewLastAddedMovies = async (req , res) => {
    try{
        const movies = await Movies.findAll();
        if(movies.length === 0){
            return res.status(404).json({ message: "No movies found" });
        }
        
        res.status(200).json({ message: movies});

    }catch(error){
        console.error(error);
        res.status(500).json({ message: error.message});
        
    }
}

module.exports = {
    viewLastAddedMovies
};