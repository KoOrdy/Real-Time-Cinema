import React, { useState, useEffect } from "react";
import axios from "axios";
import "./movies.css";
import Navbar from "./navbar";

const Lastadded = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);

  const bookedSeats = [5, 12, 18]; 

  
  useEffect(() => {
    const cinemaId = localStorage.getItem("cinemaId");
    if (!cinemaId) {
      console.error("Cinema ID not found in localStorage.");
      alert("Cinema ID not found. Please set it in localStorage.");
      return;
    }

    axios
      .get(`/lastAddedMovies/${cinemaId}`)
      .then((response) => {
        setMovies(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        alert("Failed to fetch movies. Please try again later.");
      });
  }, []);

  const handleSelectMovie = (movie) => {
    // Retrieve cinemaId from localStorage
    const cinemaId = localStorage.getItem("cinemaId");
  
    if (!cinemaId) {
      console.error("Cinema ID not found in localStorage.");
      alert("Cinema ID is not set. Please set it in localStorage.");
      return;
    }
  
    // Construct the URL with cinemaId and movieId
    const url = `/cinemas/${cinemaId}/movie/${movie.id}`;
  
    // Fetch movie details from the backend
    axios
      .get(url)
      .then((response) => {
        setSelectedMovie(response.data); // Set the movie details from the response
        setSelectedDate(""); // Clear any previously selected date
        setSelectedShowtime(""); // Clear any previously selected showtime
        setSelectedSeats([]); // Clear selected seats
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
        alert("Failed to fetch movie details. Please try again later.");
      });
  };

  const handleSelectDate = (e) => {
    setSelectedDate(e.target.value);
    setSelectedShowtime(""); // Reset showtime once a new date is selected
  };

  const handleSelectShowtime = (e) => {
    setSelectedShowtime(e.target.value);
    setSelectedSeats([]); // Clear seats when a new showtime is selected
  };

  const toggleSeatSelection = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seatNumber)
        ? prevSelected.filter((seat) => seat !== seatNumber)
        : [...prevSelected, seatNumber]
    );
  };

  const handleBookSeats = () => {
    console.log("Checking booking conditions...");
    if (!selectedDate) {
      console.log("Date not selected");
      alert("Please select a date.");
      return;
    }
    if (!selectedShowtime) {
      console.log("Showtime not selected");
      alert("Please select a showtime.");
      return;
    }
    if (selectedSeats.length === 0) {
      console.log("No seats selected");
      alert("Please select at least one seat.");
      return;
    }

    // If everything is selected correctly, show a success message
    alert(`Successfully booked seats: ${selectedSeats.join(", ")} for ${selectedMovie.title} on ${selectedDate} at ${selectedShowtime}`);
    setSelectedSeats([]); // Reset seat selection after booking
  };

  return (
    <div className="movies-page">
      <h1>Last Added Movies</h1>

      {/* Movie List */}
      {!selectedMovie ? (
        <div className="movies-list">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => handleSelectMovie(movie)}
            >
              <img src={movie.poster} alt={`${movie.title} poster`} />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="movie-details">
          <img src={selectedMovie.poster} alt={`${selectedMovie.title} poster`} />
          <h2>{selectedMovie.title}</h2>
          <p>{selectedMovie.description}</p>
          <p>Price: ${selectedMovie.price}</p>
          <p>Genre: {selectedMovie.genre}</p>
          <p>Release Date: {selectedMovie.releaseDate}</p>

          {/* Date Selection */}
          <select value={selectedDate} onChange={handleSelectDate}>
            <option value="">Select Date</option>
            <option value={selectedMovie.releaseDate}>
              {selectedMovie.releaseDate}
            </option>
          </select>

          {/* Showtime Selection (Disabled until a date is selected) */}
          {selectedDate && (
            <select value={selectedShowtime} onChange={handleSelectShowtime}>
              <option value="">Select Showtime</option>
              {selectedMovie.showtimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          )}

          {/* Seat Map (Only visible after selecting a showtime) */}
          {selectedShowtime && (
            <div className="seat-map">
              <h3>Select Seats</h3>
              <div className="seats">
                {Array.from({ length: 47 }, (_, i) => i + 1).map((seatNumber) => (
                  <div
                    key={seatNumber}
                    className={`seat ${
                      bookedSeats.includes(seatNumber)
                        ? "booked"
                        : selectedSeats.includes(seatNumber)
                        ? "selected"
                        : "available"
                    }`}
                    onClick={() => toggleSeatSelection(seatNumber)}
                  >
                    {seatNumber}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <button
            onClick={handleBookSeats}
            disabled={!selectedDate || !selectedShowtime || selectedSeats.length === 0}
          >
            Book Seats
          </button>
          <button onClick={() => setSelectedMovie(null)}>Back to Movies</button>
        </div>
      )}
    </div>
  );
};

export default Lastadded;

