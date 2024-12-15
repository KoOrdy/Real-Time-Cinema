import React, { useEffect, useState } from "react";
import './cinema.css';
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { toast } from "react-toastify";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 30.0444, // Default center (Cairo, for example)
  lng: 31.2357,
};

const Cinema = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBNlTpKQUSKdcM9skmPcEKj2_--4tOAaP4" // Replace with your API key
  });

  const [cinemas, setCinemas] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCinemaId, setCurrentCinemaId] = useState(null);
  const [newCinemaName, setNewCinemaName] = useState("");
  const [newCinemaLocation, setNewCinemaLocation] = useState({ latitude: "", longitude: "" });
  const [newCinemaContactInfo, setNewCinemaContactInfo] = useState("");

  const navigate = useNavigate(); // For navigation
  const onLogout = () => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
  
          toast.success("You will navigate to the login page after 2 seconds.",
            {
              position: "bottom-center",
              duration: 2000,
              style: {backgroundColor: "black", color: "white", width: "fit-content",},
            }
          );
          setTimeout(function() {
              window.location.replace("/login");
            }, 2000);
        }

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Token is missing. Please log in again.");
          return;
        }

        const { data, status } = await axiosInstance.get("/vendor/cinemas/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetched cinemas data:", data); // Log the full response

        if (status === 200) {
          // Check if the response contains a 'data' key that holds the cinemas array
          if (Array.isArray(data.data)) {
            setCinemas(data.data); // If 'data' holds an array, set it directly
          } else {
            alert("Cinemas data is not in the expected format.");
          }
        } else {
          alert("Failed to fetch cinemas.");
        }
      } catch (error) {
        console.error("Error fetching cinemas:", error);
      }
    };

    fetchCinemas();
  }, []);  

  // Edit Cinema
  const handleEditCinema = (id) => {
    const cinema = cinemas.find((cinema) => cinema.id === id);
    if (cinema) {
      setNewCinemaName(cinema.name);
      setNewCinemaLocation(cinema.location || { latitude: "", longitude: "" }); // Safeguard for missing location
      setNewCinemaContactInfo(cinema.contactInfo);
      setCurrentCinemaId(id);
      setEditMode(true);
      setShowModal(true);
    }
  };

  // Add Cinema
  const handleAddCinema = () => {
    setEditMode(false);
    setNewCinemaName("");
    setNewCinemaLocation({ latitude: "", longitude: "" });
    setNewCinemaContactInfo("");
    setShowModal(true);
  };

  // Modal Submit: Add or Update Cinema
  const handleModalSubmit = async () => {
    // Ensure all fields are filled
    if (!newCinemaName || !newCinemaLocation.latitude || !newCinemaLocation.longitude || !newCinemaContactInfo) {
      alert("All fields are required!");  // This alert can be customized
      return;
    }

    const newCinema = {
      name: newCinemaName,
      location: newCinemaLocation,
      contactInfo: newCinemaContactInfo,
    };

    try {
      if (editMode) {
        // Update cinema logic
        const response = await axiosInstance.put(`/vendor/cinemas/update/${currentCinemaId}`, newCinema, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.status === 201) {
          setCinemas(cinemas.map((cinema) => 
            cinema.id === currentCinemaId ? { ...cinema, ...newCinema } : cinema
          ));

          alert("Cinema updated successfully.");
        }
      } else {
        // Add new cinema logic
        const response = await axiosInstance.post("vendor/cinemas/add", newCinema, {  // Make sure this endpoint is correct
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.status === 201) {
          setCinemas([...cinemas, response.data]);  // Add the new cinema to the list
          alert("Cinema added successfully.");
        } else {
          alert("Failed to add cinema. Please try again.");
        }
      }

      // Reset the form fields
      setNewCinemaName("");
      setNewCinemaLocation({ latitude: "", longitude: "" });
      setNewCinemaContactInfo("");
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting cinema:", error);
      alert("An error occurred while submitting the cinema. Please try again.");
    }
  };

  // Delete Cinema
  const handleDelete = async (id) => {
    const confirmation = window.confirm(`Are you sure you want to delete the cinema with ID: ${id}?`);
    if (confirmation) {
      try {
        await axiosInstance.delete(`/vendor/cinemas/delete/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setCinemas(cinemas.filter((cinema) => cinema.id !== id));
        alert(`Cinema with ID: ${id} has been deleted.`);
      } catch (error) {
        console.error("Error deleting cinema:", error);
        alert("Failed to delete cinema. Please try again.");
      }
    }
  };

  // Map click handler to set location
  const handleMapClick = (event) => {
    const { lat, lng } = event.latLng.toJSON();
    setNewCinemaLocation({ latitude: lat, longitude: lng });
  };

  // Store cinema ID and navigate to halls page
  const handleViewHalls = (cinemaId) => {
    localStorage.setItem('cinemaId', cinemaId); // Store the cinema ID in localStorage
    navigate(`/halls/${cinemaId}`); // Navigate to the halls page with the cinema ID
  };

  return (
    <div className="vendor-container">
      <h1>Cinema Management</h1>

      <div className="vendor-operations">
        <button className="btn" onClick={handleAddCinema}>
          Add Cinema
        </button>
        <button className="btn" type="button" onClick={onLogout}>logout</button>
      </div>

      <table className="vendor-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Contact Info</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cinemas.map((cinema) => (
            <tr key={cinema.id}>
              <td>{cinema.id}</td>
              <td>{cinema.name}</td>
              <td>
                {cinema.location && cinema.location.latitude && cinema.location.longitude ? (
                  `Latitude: ${cinema.location.latitude}, Longitude: ${cinema.location.longitude}`
                ) : (
                  "Location not available"
                )}
              </td>
              <td>{cinema.contactInfo}</td>
              <td>
                <button className="btn btn-edit" onClick={() => handleEditCinema(cinema.id)}>Edit</button>
                <Link to={`/movies/${cinema.id}`} className="btn btn-view">View Movies</Link>
                <Link to={`${cinema.id}/halls`}
                  className="btn btn-viewh" 
                  onClick={() => handleViewHalls(cinema.id)} 
                >
                  View Halls
                </Link>
                <button className="btn btn-delete" onClick={() => handleDelete(cinema.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editMode ? "Edit Cinema" : "Add New Cinema"}</h2>
            <label>Name:</label>
            <input type="text" value={newCinemaName} onChange={(e) => setNewCinemaName(e.target.value)} />

            <label>Latitude:</label>
            <input type="text" value={newCinemaLocation.latitude} readOnly />

            <label>Longitude:</label>
            <input type="text" value={newCinemaLocation.longitude} readOnly />

            <label>Contact Info:</label>
            <input type="text" value={newCinemaContactInfo} onChange={(e) => setNewCinemaContactInfo(e.target.value)} />

            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={10}
                onClick={handleMapClick}
              >
                {newCinemaLocation.latitude && newCinemaLocation.longitude && (
                  <Marker position={{ lat: parseFloat(newCinemaLocation.latitude), lng: parseFloat(newCinemaLocation.longitude) }} />
                )}
              </GoogleMap>
            ) : (
              <p>Loading map...</p>
            )}

            <div className="modal-actions">
              <button className="btn" onClick={handleModalSubmit}>Submit</button>
              <button className="btn btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cinema;