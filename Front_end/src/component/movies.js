import React, { useState } from "react";
import "./movies.css";
import pster from "./poster.webp";
import Navbar from "./navbar";
import MapContainer from "./MapContainer";

const MoviesPage = () => {
  const center = {
    lat: 29.9773,
    lng: 31.1325
  }
  const locations =[
    {
      lat: 50.9773,
      lng: 50.1325
    },
    {
      lat: 75.9773,
      lng: 75.1325
    }
  ]

  const containerStyle = {
    width: '100%',
    height: '800px',
  }
 
  const [movies] = useState([
    {
      id: 1,
      title: "Movie 1",
      description: "This is the description for Movie 1.",
      price: 10,
      genre: "Action",
      releaseDate: "2023-11-20",
      poster: pster,
      showtimes: ["10:00 AM", "1:00 PM", "6:00 PM"],
    },
    {
      id: 2,
      title: "Movie 2",
      description: "This is the description for Movie 2.",
      price: 15,
      genre: "Comedy",
      releaseDate: "2023-12-05",
      poster: pster,
      showtimes: ["12:00 PM", "3:00 PM", "9:00 PM"],
    },
    {
      id: 3,
      title: "Movie 3",
      description: "This is the description for Movie 3.",
      price: 12,
      genre: "Drama",
      releaseDate: "2024-01-10",
      poster: pster,
      showtimes: ["11:00 AM", "4:00 PM", "8:00 PM"],
    },
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const bookedSeats = [5, 12, 18]; // Example booked seats

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterGenre = (e) => {
    setFilterGenre(e.target.value);
  };

  const handleFilterDate = (e) => {
    setFilterDate(e.target.value);
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesTitle = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = filterGenre ? movie.genre === filterGenre : true;
    const matchesDate = filterDate ? movie.releaseDate === filterDate : true;
    return matchesTitle && matchesGenre && matchesDate;
  });

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setSelectedDate(""); // Clear any previously selected date
    setSelectedShowtime(""); // Clear any previously selected showtime
    setSelectedSeats([]); // Clear selected seats
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
      <Navbar />
      <h1>Movies</h1>
    <MapContainer  mapContainerStyle={containerStyle} coordinates={center} mainLocation={center} locations={locations}/>
      {/* Search and Filter */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select onChange={handleFilterGenre} value={filterGenre}>
          <option value="">Filter by Genre</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
        </select>
        <input type="date" onChange={handleFilterDate} value={filterDate} />
      </div>

      {/* Movie List */}
      {!selectedMovie ? (
        <div className="movies-list">
          {filteredMovies.map((movie) => (
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

export default MoviesPage;
