import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosInstance";
import moment from "moment";
import { useParams } from "react-router-dom";
import "./lastadded.css";

const Lastadded = () => {
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [filter, setFilter] = useState(false);
 
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const url = filter ? `/customer/movies/${id}` : `/customer/lastAddedMovies/${id}`;
        const response = await axiosInstance.get(url);
        if (response.data && response.data.data) {
          setMovies(response.data.data);
          setFilteredMovies(response.data.data);
        } else {
          alert("Failed to fetch movies. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        alert("Failed to fetch movies. Please try again later.");
      }
    };

    fetchMovies();
  }, [filter, id]);

  const fetchSeats = async (showtimeId) => {
    try {
      const response = await axiosInstance.get(`customer/showTimeId/${showtimeId}/seats`);
      if (response.data && response.data.data) {
        const seatsData = response.data.data;
        console.log("Seat fetch response:", response.data);
        setSeats(seatsData);
        setBookedSeats(seatsData.filter((seat) => seat.seatStatus === "booked").map((seat) => seat.seatID));
        setSelectedSeats([]);
      } else {
        setSeats([]);
        setBookedSeats([]);
      }
    } catch (error) {
      console.error("Error fetching seats:", error);
      alert("Failed to fetch seats. Please try again later.");
      setSeats([]);
      setBookedSeats([]);
    }
  };

  const handleSelectMovie = (movie) => {
    const cinemaId = localStorage.getItem("selectedCinemaId");

    if (!cinemaId) {
      alert("Cinema ID is not set. Please set it in localStorage.");
      return;
    }

    const movieUrl = `/customer/cinemas/${cinemaId}/movie/${movie.id}`;
    const datesUrl = `/customer/cinemas/${cinemaId}/movie/${movie.id}/dates`;

    axiosInstance
      .get(movieUrl)
      .then((response) => {
        setSelectedMovie(response.data.data);
        setSelectedDate("");
        setSelectedShowtime("");
        setSelectedSeats([]);
        setShowtimes([]);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
        alert("Failed to fetch movie details. Please try again later.");
      });

    axiosInstance
      .get(datesUrl)
      .then((response) => {
        if (response.data && response.data.data) {
          setAvailableDates(response.data.data.map((d) => d.date));
        } else {
          setAvailableDates([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching movie dates:", error);
        alert("Failed to fetch available dates. Please try again later.");
      });
  };

  const handleSelectDate = (e) => {
    const selectedDate = e.target.value;
    setSelectedDate(selectedDate);
    setSelectedShowtime("");
    setSelectedSeats([]);
    setShowtimes([]);

    if (!selectedDate) return;

    const cinemaId = localStorage.getItem("selectedCinemaId");
    if (!cinemaId || !selectedMovie) return;

    const showtimesUrl = `/customer/cinemas/${cinemaId}/movie/${selectedMovie.id}/showtimes?date=${selectedDate}`;

    axiosInstance
      .get(showtimesUrl)
      .then((response) => {
        if (response.data && response.data.data) {
          setShowtimes(response.data.data);
        } else {
          setShowtimes([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching showtimes:", error);
        alert("Failed to fetch showtimes. Please try again later.");
      });
  };

  const handleSelectShowtime = (e) => {
    const selectedShowtime = e.target.value;
    setSelectedShowtime(selectedShowtime);
    setSelectedSeats([]);
    fetchSeats(selectedShowtime);
  };

  const toggleSeatSelection = (seatID) => {
    if (bookedSeats.includes(seatID)) {
      return;
    }

    const updatedSelectedSeats = [...selectedSeats];
    const seatIndex = updatedSelectedSeats.indexOf(seatID);

    if (seatIndex === -1) {
      updatedSelectedSeats.push(seatID);
    } else {
      updatedSelectedSeats.splice(seatIndex, 1);
    }

    setSelectedSeats(updatedSelectedSeats);
  };

  const handleBookSeats = async () => {
    if (!selectedDate || !selectedShowtime || selectedSeats.length === 0) {
      alert("Please select a date, showtime, and seats before booking.");
      return;
    }

    try {
      const cinemaId = localStorage.getItem("selectedCinemaId");
      if (!cinemaId) {
        alert("Cinema ID is not set. Please set it in localStorage.");
        return;
      }

      const bookingData = {
        movieId: selectedMovie.id,
        showtimeId: selectedShowtime,
        seatIds: selectedSeats,
        totalPrice: selectedMovie.price * selectedSeats.length,
        cinemaId: cinemaId,
      };

      const response = await axiosInstance.post("/customer/bookSeat", bookingData);

      if (response.data && response.data.message) {
        alert(
          `Successfully booked seats: ${selectedSeats.join(", ")} for ${selectedMovie.title}`
        );
        setSelectedSeats([]); // Clear selected seats

        fetchSeats(selectedShowtime);
      } else {
        alert("Failed to book seats. Please try again later.");
      }
    } catch (error) {
      console.error("Error booking seats:", error);
      alert("Failed to book seats. Please try again later.");
    }
  };


  return (
    <div className="movies-page">
      <h1>Last Added Movies</h1>
      <button onClick={() => setFilter(true)}>Show All Movies</button>
      <button onClick={() => setFilter(false)}>Show Last Added Movies</button>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
        <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
          <option value="">Filter by Genre</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          <option value="Horror">Horror</option>
        </select>
      </div>

      {!selectedMovie ? (
        <div className="movies-list">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <div key={movie.id} className="movie-card" onClick={() => handleSelectMovie(movie)}>
                <img src={movie.poster} alt={`${movie.title} poster`} />
                <h3>{movie.title}</h3>
              </div>
            ))
          ) : (
            <p>No movies available to display.</p>
          )}
        </div>
      ) : (
        <div className="movie-details">
          <img src={selectedMovie.poster} alt={`${selectedMovie.title} poster`} />
          <h2>{selectedMovie.title}</h2>
          <p>{selectedMovie.description}</p>
          <p>Price: ${selectedMovie.price}</p>
          <p>Genre: {selectedMovie.genre}</p>
          <p>Release Date: {moment(selectedMovie.createdAt).format('MMMM Do YYYY')}</p>

          {/* Date Selection */}
          <select value={selectedDate} onChange={handleSelectDate}>
            <option value="">Select Date</option>
            {availableDates.length > 0 ? (
              availableDates.map((date) => (
                <option key={date} value={date}>
                  {moment(date).format('DD/MM/YYYY')}
                </option>
              ))
            ) : (
              <option value="">No dates available</option>
            )}
          </select>

          {/* Showtime Selection */}
          {selectedDate && showtimes.length > 0 && (
            <select value={selectedShowtime} onChange={handleSelectShowtime}>
              <option value="">Select Showtime</option>
              {showtimes.map((showtime) => (
                <option key={showtime.startTime} value={showtime.id}>
                  {showtime.startTime}
                </option>
              ))}
            </select>
          )}

          {seats.length > 0 && (
            <div className="seats">
              {seats.map((seat) => (
                <button
                  key={seat.seatID}
                  className={`seat ${bookedSeats.includes(seat.seatID) ? "booked" : selectedSeats.includes(seat.seatID) ? "selected" : ""}`}
                  onClick={() => toggleSeatSelection(seat.seatID)}
                  disabled={bookedSeats.includes(seat.seatID)}
                >
                  {seat.seatName}
                </button>
              ))}
            </div>
          )}

          <button onClick={handleBookSeats} className="book-button">
            Book Selected Seats
          </button>

          {/* Back to All Movies Button */}
          <button
            className="back-button"
            onClick={() => {
              window.location.href = window.location.href;
            }}
          >
            Back to All Movies
          </button>
        </div>
      )}
    </div>
  );
};

export default Lastadded;