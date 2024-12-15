import React, { useEffect, useState } from "react";
import "./vendormovies.css";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../config/axiosInstance"; // Import the axiosInstance
import moment from "moment";

const VMovies = () => {
  const { cinemaId } = useParams();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // For updating movie state
  const [updateDetails, setUpdateDetails] = useState({
    title: "",
    description: "",
    price: "",
    genre: "",
    duration: "",
    releaseDate: "",
    poster: null,
  });

  // For adding new movie state
  const [newMovieDetails, setNewMovieDetails] = useState({
    title: "",
    description: "",
    price: "",
    genre: "",
    duration: "",
    releaseDate: "",
    poster: null,
  });

  // Fetch movies on load
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/vendor/${cinemaId}/movies`);

        if (response.data && Array.isArray(response.data.data)) {
          setMovies(response.data.data);
        } else {
          setMovies([]);
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to fetch movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [cinemaId]);

  // Handle selecting a movie for update
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setUpdateDetails({ ...movie });
    setIsModalOpen(true);
  };

  // Handle updating movie details
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image change for update
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdateDetails((prev) => ({ ...prev, poster: file }));
    }
  };

  // Handle updating movie
  const handleUpdateMovie = async () => {
    try {
      const formData = new FormData();
      formData.append("title", updateDetails.title);
      formData.append("description", updateDetails.description);
      formData.append("price", updateDetails.price);
      formData.append("genre", updateDetails.genre);
      formData.append("duration", updateDetails.duration);
      formData.append("releaseDate", updateDetails.releaseDate);

      if (updateDetails.poster instanceof File) {
        formData.append("poster", updateDetails.poster);
      }

      const response = await axiosInstance.put(
        `/vendor/${cinemaId}/updatemovies/${selectedMovie.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.success) {
        // Update the movie list with the updated movie
        setMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie.id === selectedMovie.id ? response.data.data : movie
          )
        );
        alert("Movie updated successfully!");
        setIsModalOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to update movie.");
      }
    } catch (err) {
      console.error("Error updating movie:", err);
      alert(err.message || "Failed to update movie. Please try again later.");
    }
  };

  // Handle adding a new movie
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewMovieDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMovieDetails((prev) => ({ ...prev, poster: file }));
    }
  };

  const handleAddMovie = async () => {
    try {
      if (
        !newMovieDetails.title ||
        !newMovieDetails.description ||
        !newMovieDetails.price ||
        !newMovieDetails.genre ||
        !newMovieDetails.duration ||
        !newMovieDetails.releaseDate ||
        !newMovieDetails.poster
      ) {
        setError("All fields are required.");
        return;
      }

      const formData = new FormData();
      Object.keys(newMovieDetails).forEach((key) => {
        formData.append(key, newMovieDetails[key]);
      });

      const response = await axiosInstance.post(
        `/vendor/${cinemaId}/addmovies`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.success) {
        const newMovie = response.data.data;
        setMovies((prevMovies) => [...prevMovies, newMovie]);
        setIsAddModalOpen(false);
        setNewMovieDetails({
          title: "",
          description: "",
          price: "",
          genre: "",
          duration: "",
          releaseDate: "",
          poster: null,
        });
        setError(null);
      } else {
        throw new Error("Failed to add movie.");
      }
    } catch (err) {
      console.error("Error adding movie:", err);
      setError(err.message || "Failed to add movie. Please try again later.");
    }
  };

  // Handle deleting a movie
  const handleDeleteMovie = async () => {
    try {
      const response = await axiosInstance.delete(
        `/vendor/${cinemaId}/deletemovies/${selectedMovie.id}`
      );

      if (response.data && response.data.success) {
        setMovies((prevMovies) =>
          prevMovies.filter((movie) => movie.id !== selectedMovie.id)
        );
        setIsModalOpen(false);
        setSelectedMovie(null);
      } else {
        alert("Failed to delete movie.");
      }
    } catch (err) {
      console.error("Error deleting movie:", err);
      setError(err.message || "Failed to delete movie. Please try again later.");
    }
  };

  return (
    <div className="movies-page">
      <h1>Movies Management</h1>

      <div className="filters">
        <Link to="/cinemas" className="btn-back">
          Back To Cinemas
        </Link>
        <button onClick={() => setIsAddModalOpen(true)} className="btn-add">
          Add Movie
        </button>
      </div>

      {isLoading && <p>Loading movies...</p>}
      {error && <p className="error">{error}</p>}

      {!selectedMovie ? (
        <div className="movies-list">
          {Array.isArray(movies) && movies.length > 0 ? (
            movies.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => handleSelectMovie(movie)}
              >
                <img src={movie.poster} alt={`${movie.title} poster`} />
                <h3>{movie.title}</h3>
                <p>Hall: {movie.hall}</p>
              </div>
            ))
          ) : (
            <p>No movies found for this cinema.</p> // Friendly message if no movies are found
          )}
        </div>
      ) : (
        <div className="movie-details">
          <img src={selectedMovie.poster} alt={`${selectedMovie.title} poster`} />
          <h2>{selectedMovie.title}</h2>
          <p>{selectedMovie.description}</p>
          <p>Price: ${selectedMovie.price}</p>
          <p>Genre: {selectedMovie.genre}</p>
          <p>Duration: {selectedMovie.duration} minutes</p>
          <p>Release Date: {moment(selectedMovie.releaseDate).format('DD/MM/YYYY')}</p> {/* Correct moment usage */}
          <button onClick={() => setIsModalOpen(true)}>Update Movie</button>
          <button onClick={handleDeleteMovie} className="btn-delete">
            Delete Movie
          </button>
          <button onClick={() => setSelectedMovie(null)}>Back to Movies</button>
        </div>
      )}

      {/* Update Movie Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Movie</h2>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={updateDetails.title}
                onChange={handleUpdateChange}
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={updateDetails.description}
                onChange={handleUpdateChange}
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                name="price"
                value={updateDetails.price}
                onChange={handleUpdateChange}
              />
            </label>
            <label>
              Genre:
              <select
                name="genre"
                value={updateDetails.genre}
                onChange={handleUpdateChange}
              >
                <option value="">Select Genre</option>
                <option value="Action">Action</option>
                <option value="Drama">Drama</option>
                <option value="Comedy">Comedy</option>
                <option value="Thriller">Thriller</option>
                <option value="Horror">Horror</option>
              </select>
            </label>
            <label>
              Duration:
              <input
                type="number"
                name="duration"
                value={updateDetails.duration}
                onChange={handleUpdateChange}
              />
            </label>
            <label>
              Release Date:
              <input
                type="date"
                name="releaseDate"
                value={updateDetails.releaseDate}
                onChange={handleUpdateChange}
              />
            </label>
            <label>
              Poster:
              <input
                type="file"
                name="poster"
                onChange={handleImageChange}
              />
            </label>
            <button onClick={handleUpdateMovie}>Update Movie</button>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Add New Movie Modal */}
      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Movie</h2>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={newMovieDetails.title}
                onChange={handleAddChange}
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={newMovieDetails.description}
                onChange={handleAddChange}
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                name="price"
                value={newMovieDetails.price}
                onChange={handleAddChange}
              />
            </label>
            <label>
              Genre:
              <select
                name="genre"
                value={newMovieDetails.genre}
                onChange={handleAddChange}
              >
                <option value="">Select Genre</option>
                <option value="Action">Action</option>
                <option value="Drama">Drama</option>
                <option value="Comedy">Comedy</option>
                <option value="Thriller">Thriller</option>
                <option value="Horror">Horror</option>
              </select>
            </label>
            <label>
              Duration:
              <input
                type="number"
                name="duration"
                value={newMovieDetails.duration}
                onChange={handleAddChange}
              />
            </label>
            <label>
              Release Date:
              <input
                type="date"
                name="releaseDate"
                value={newMovieDetails.releaseDate}
                onChange={handleAddChange}
              />
            </label>
            <label>
              Poster:
              <input
                type="file"
                name="poster"
                onChange={handleAddImageChange}
              />
            </label>
            <button onClick={handleAddMovie}>Add Movie</button>
            <button onClick={() => setIsAddModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VMovies;