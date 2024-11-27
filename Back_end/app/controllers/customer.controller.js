const { Movies, Cinemas, Users, UserDetails, Bookings, Seats, Showtimes, Notifications } = require("../models");

exports.viewLastAddedMovies = (req , res) => {
    if(req.user.role !== 'customer'){
        return res.status(403).json({ message: "You are nor authorized to view movies." });
    }

    const cinemaID = req.params.cinemaId;

    Movies.findAll({
        include: [
            {
                model: Cinemas,
                as: 'cinemas',
                where: { id: cinemaID},
                required: true,
                attributes: [],
            },
        ],
        attributes: ['id' , 'Poster' , 'title' , 'description' , 'createdAt'],
        order: [['createdAt' , 'DESC']],
        limit: 5,
    })
    .then((movies => {
        if(!movies.length){
            return res.status(404).json({ message: "No movies found for this cinema." });
        }

        return res.status(200).json({ message: "Movies fetched successfully" , data: movies });
    }))
    .catch((error) => {
        console.error(error);
        return res.status(500).json({ message: "Error" , data: error.message });
    });
};