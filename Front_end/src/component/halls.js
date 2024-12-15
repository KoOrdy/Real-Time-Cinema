import React, { useEffect, useState } from "react";
import "./halls.css";
import axiosInstance from "../config/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

const Halls = () => {
  const [halls, setHalls] = useState([]);
  const [hallInput, setHallInput] = useState("");
  const [selectedHall, setSelectedHall] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [movieDetails, setMovieDetails] = useState({
    movieName: "",
    startTime: "",
    endTime: "",
    day: "",
  });
  const [viewSeatsMode, setViewSeatsMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const { cinemaId } = useParams(); // Get cinemaId from the URL
  const [forceRefresh, setForceRefresh] = useState(false);

  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchHalls = async () => {
      if (!cinemaId) {
        console.error("Cinema ID is undefined.");
        alert("Invalid cinema ID. Please check the URL or navigate correctly.");
        return;
      }
      try {
        // Correct API call
        const response = await axiosInstance.get(`vendor/${cinemaId}/halls`);
        
        // Log the full response to inspect it
        console.log(response.data);  // Log the full response object

        // Check if 'data' and 'data' has halls
        if (response.data && response.data.data && response.data.data.length > 0) {
          setHalls(response.data.data);  // Set halls from the 'data' key
          console.log("Halls:", response.data.data);  // Log halls data
        } else {
          console.log("No halls available.");
        }
      } catch (error) {
        console.error("Error fetching halls:", error.message);
        alert("Unable to fetch halls. Please try again later.");
      }
    };

    fetchHalls();
  }, [cinemaId, forceRefresh]);

  const handleQuickRefresh = () => {
    setForceRefresh(true); // Trigger the fetch on the next render cycle
  };

  const addHall = async () => {
    if (/^[A-Z]$/.test(hallInput)) {
      // Check if the hall already exists in the list of halls
      if (halls.some((hall) => hall.name === hallInput)) {
        alert(`Hall ${hallInput} already exists. Please choose a different letter.`);
        return;
      }

      try {
        // Send POST request to the backend to add a new hall
        const response = await axiosInstance.post(
          `vendor/${cinemaId}/addhalls`,
          { name: hallInput } // The data you're sending with the request
        );

        // If the request is successful
        if (response.data.message === "Hall added successfully") {
          // Add the new hall to the state
          setHalls([...halls, { name: hallInput, movies: [] }]);
          setHallInput(""); // Clear the input field
          alert("Hall added successfully!");

          // Trigger a refresh to re-fetch the updated halls list
          setForceRefresh(!forceRefresh); // Toggle the forceRefresh state
        }
      } catch (error) {
        setForceRefresh(!forceRefresh);
      }
    } else {
      alert("Hall name must be a single uppercase letter (A-Z).");
    }
  };

  const viewHallDetails = (hall) => {
    if (!hall || !hall.id) {
      console.error("Hall ID is missing", hall);
      alert("Hall ID is missing or invalid. Cannot view details.");
      return;
    }
    setSelectedHall(hall);
    setShowModal(true);
    setMovieDetails({
      movieName: "",
      startTime: "",
      endTime: "",
      day: "",
    });
    setIsEditing(false); // Close edit mode when opening details
    setCurrentMovieIndex(null);

    // Navigate to the hall details page, ensuring hall.id exists
    navigate(`/${cinemaId}/halls/${hall.id}`);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedHall(null);
    setMovieDetails({
      movieName: "",
      startTime: "",
      endTime: "",
      day: "",
    });
    setViewSeatsMode(false);
    setToastMessage(""); // Clear any toast message when closing modal
  };

  const validateShowtimes = (startTime, endTime, day, excludeIndex = null) => {
    return !selectedHall.movies.some((movie, index) => {
      return (
        index !== excludeIndex &&
        movie.day === day &&
        (
          (startTime >= movie.startTime && startTime < movie.endTime) ||
          (endTime > movie.startTime && endTime <= movie.endTime) ||
          (startTime <= movie.startTime && endTime >= movie.endTime)
        )
      );
    });
  };

  const addMovie = () => {
    const { movieName, startTime, endTime, day } = movieDetails;
    if (!movieName || !startTime || !endTime || !day) {
      alert("All fields are required!");
      return;
    }

    if (endTime <= startTime) {
      alert("End time must be after the start time.");
      return;
    }

    if (!validateShowtimes(startTime, endTime, day)) {
      alert("This movie's showtime overlaps with another movie on the same day in this hall.");
      return;
    }

    const updatedHalls = halls.map((hall) => {
      if (hall.name === selectedHall.name) {
        return {
          ...hall,
          movies: [...hall.movies, { ...movieDetails }],
        };
      }
      return hall;
    });
    setHalls(updatedHalls);
    closeModal();
  };

  const updateMovie = () => {
    const { movieName, startTime, endTime, day } = movieDetails;

    if (!movieName || !startTime || !endTime || !day) {
      alert("All fields are required!");
      return;
    }

    if (endTime <= startTime) {
      alert("End time must be after the start time.");
      return;
    }

    if (!validateShowtimes(startTime, endTime, day, currentMovieIndex)) {
      alert("This movie's showtime overlaps with another movie on the same day in this hall.");
      return;
    }

    const updatedMovies = selectedHall.movies.map((movie, index) =>
      index === currentMovieIndex ? { ...movieDetails } : movie
    );

    const updatedHalls = halls.map((hall) =>
      hall.name === selectedHall.name ? { ...hall, movies: updatedMovies } : hall
    );
    setHalls(updatedHalls);
    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieDetails((prev) => ({ ...prev, [name]: value }));
  };

  const toggleViewSeats = (movie, index) => {
    setViewSeatsMode(true); // Enable seat map view
    setMovieDetails(movie);
    setCurrentMovieIndex(index);

    if (movie) {
      // Assume first 30 seats are booked, rest are available
      const bookedSeats = 30; // Adjust this number based on actual bookings
      const totalSeats = 47;
      setToastMessage(`${bookedSeats} seats are booked.`);
    }
  };
  
  const closeSeatMap = () => {
    setViewSeatsMode(false);
    setToastMessage(""); // Clear the toast message when leaving the seat map view
  };

  const renderSeats = () => {
    const seats = Array.from({ length: 47 }, (_, i) => i + 1);
    return seats.map((seatNumber) => (
      <div
        key={seatNumber}
        className={`seat ${seatNumber <= 30 ? "booked" : "available"}`}
      >
        {seatNumber}
      </div>
    ));
  };

  return (
    <div className="halls">
      <h1>Manage Halls</h1>

      <div className="add-hall">
        <input
          type="text"
          placeholder="Enter Hall Name (A-Z)"
          value={hallInput}
          onChange={(e) => setHallInput(e.target.value)}
        />
        <button onClick={addHall}>Add Hall</button>
      </div>

      <div className="halls-list">
        {halls.map((hall) => (
          <div key={hall.id} className="hall-card">
            <h2>{hall.name}</h2>
            <button onClick={() => viewHallDetails(hall)}>
              View Hall Details
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Details for Hall {selectedHall.name}</h3>

            {!viewSeatsMode ? (
              <>
                <ul>
                  {selectedHall.movies.map((movie, index) => (
                    <li key={index}>
                      {movie.movieName} ({movie.startTime} - {movie.endTime})
                      <button onClick={() => toggleViewSeats(movie, index)}>
                        View Seats
                      </button>
                    </li>
                  ))}
                </ul>

                <button onClick={addMovie}>
                  {isEditing ? "Update Movie" : "Add Movie"}
                </button>
                <button onClick={closeModal}>Close</button>
              </>
            ) : (
              <div>
                <h3>Seat Map</h3>
                <div className="seats">
                  {renderSeats()}
                </div>
                <button onClick={closeSeatMap}>Close Seat Map</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Halls;