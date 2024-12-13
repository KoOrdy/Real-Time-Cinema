import React, { useState, useEffect } from "react";
import axios from "axios";
import "./movies.css";
import Navbar from "./navbar";
import { useParams } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";

const Lastadded = () => {
  const[filter,setfilter]=useState(false);
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const bookedSeats = [5, 12, 18]; // Example booked seats

  useEffect(() => {
    const fetchMovies = async () => {
      console.log(filter);
      try {
        const url = filter 
          ? `/customer/movies/${id}` 
          : `/customer/lastAddedMovies/${id}`;
        
        const response = await axiosInstance.get(url);
        console.log("Movies fetched:", response.data);
        
        if (response.data && response.data.data) {
          setMovies(response.data.data); 
        } else {
          console.error("Unexpected response format:", response.data);
          alert("Failed to fetch movies. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        alert("Failed to fetch movies. Please try again later.");
      }
    };
  
    fetchMovies();
  }, [filter, id]); 

  const handleSelectMovie = (movie) => {
    const cinemaId = localStorage.getItem("selectedCinemaId");

    if (!cinemaId) {
        console.error("Cinema ID not found in localStorage.");
        alert("Cinema ID is not set. Please set it in localStorage.");
        return;
    }

    const url = `/customer/cinemas/${cinemaId}/movie/${movie.id}`;
    console.log("Fetching URL:", url);
  
    axiosInstance
        .get(url)
        .then((response) => {
            console.log("Backend Response:", response.data);
            setSelectedMovie(response.data.data); 
            setSelectedDate("");
            setSelectedShowtime("");
            setSelectedSeats([]);
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

    alert(`Successfully booked seats: ${selectedSeats.join(", ")} for ${selectedMovie.title} on ${selectedDate} at ${selectedShowtime}`);
    setSelectedSeats([]); 
  };

  return (
    <div className="movies-page">
      <h1>Last Added Movies</h1>
      <button type="button" onClick={() => setfilter(true)}>Show All Movies</button>
      <button type="button" onClick={() => setfilter(false)}>Show Last Added Movies</button>
      {/* Movie List */}
      {!selectedMovie ? (
        <div className="movies-list">
          {movies?.map((movie) => (
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


