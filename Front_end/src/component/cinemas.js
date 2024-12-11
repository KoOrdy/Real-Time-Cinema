import React, { useState, useEffect } from "react";
import "./cinema.css";
import axiosInstance from "../config/axiosInstance";


const Cinema = () => {
  const [cinemas, setCinemas] = useState([]); // Initializing as an empty array
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCinemaId, setCurrentCinemaId] = useState(null);
  const [newCinemaName, setNewCinemaName] = useState("");
  const [newCinemaLocation, setNewCinemaLocation] = useState({
    latitude: "",
    longitude: "",
  });
  const [newCinemaContactInfo, setNewCinemaContactInfo] = useState("");

  useEffect(() => {
  const fetchCinemas = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);
  
      if (!token) {
        alert("Token is missing. Please log in again.");
        return;
      }
  
      const { data, status } = await axiosInstance.get("/vendor/cinemas/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Log the API response to verify data structure
      console.log("Fetched cinemas data:", data); 

      if (status == 200) {
        // Check if the data is an array and set it
        setCinemas(data);
      } else {
        alert("Failed to fetch cinemas");
      }
    } catch (error) {
      console.error("Error fetching cinemas:", error.response || error);
    }
  };

  fetchCinemas();
}, []);

  

  const handleAddCinema = () => {
    setEditMode(false);
    setShowModal(true);
  };

  const handleEditCinema = async (id) => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("Token is missing. Please log in again.");
        return;
      }
  
      // Fetch cinema details by ID for editing
      const { data, status } = await axiosInstance.put(`/vendor/cinemas/update/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (status === 200) {
        setNewCinemaName(data.name);
        setNewCinemaLocation(data.location || { latitude: "", longitude: "" });
        setNewCinemaContactInfo(data.contactInfo || "");
        setCurrentCinemaId(id); // Store the ID of the cinema being edited
        setEditMode(true);
        setShowModal(true);
      } else {
        alert("Failed to fetch cinema details.");
      }
    } catch (error) {
      console.error("Error fetching cinema details:", error.response || error);
      alert("An error occurred while fetching cinema details. Please try again.");
    }
  };
  
  

  const handleModalSubmit = async (id) => {
    if (
      newCinemaName &&
      newCinemaLocation.latitude &&
      newCinemaLocation.longitude &&
      newCinemaContactInfo
    ) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Token is missing. Please log in again.");
          return;
        }

        const newCinema = {
          name: newCinemaName,
          location: newCinemaLocation,
          contactInfo: newCinemaContactInfo,
        };

        if (editMode) {
          const { status } = await axiosInstance.put(
            `/vendor/cinemas/update/${id}`,
            newCinema,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (status === 200) {
            setCinemas((prevCinemas) =>
              prevCinemas.map((cinema) =>
                cinema.id === currentCinemaId
                  ? { ...cinema, ...newCinema }
                  : cinema
              )
            );
            alert("Cinema updated successfully.");
          } else {
            alert("Failed to update cinema.");
          }
        } else {
          const { data, status } = await axiosInstance.post(
            "/vendor/cinemas/add",
            newCinema,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (status === 201) {
            setCinemas((prevCinemas) =>
              Array.isArray(prevCinemas) ? [...prevCinemas, data] : [data]
            );
            alert("Cinema added successfully.");
          } else {
            alert("Failed to add cinema.");
          }
        }

        setNewCinemaName("");
        setNewCinemaLocation({ latitude: "", longitude: "" });
        setNewCinemaContactInfo("");
        setShowModal(false);
      } catch (error) {
        console.error("Error submitting cinema:", error.response || error);
        alert(
          "An error occurred while submitting the cinema. Please try again."
        );
      }
    } else {
      alert("Please fill out all fields.");
    }
  };

  const handleModalCancel = () => {
    setNewCinemaName("");
    setNewCinemaLocation({ latitude: "", longitude: "" });
    setNewCinemaContactInfo("");
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    try {
      const confirmation = window.confirm(
        `Are you sure you want to delete the cinema with ID: ${id}?`
      );
      if (!confirmation) return;

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token is missing. Please log in again.");
        return;
      }

      const { status } = await axiosInstance.delete(
        `/vendor/cinemas/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
    } catch (error) {
      console.error("Error deleting cinema:", error.response || error);
      alert("An error occurred while trying to delete the cinema. Please try again.");
    }
  };

  return (
    <div className="vendor-container">
      <h1>Cinema Management</h1>

      <div className="vendor-operations">
        <button className="btn" onClick={handleAddCinema}>
          Add Cinema
        </button>
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
   {
    cinemas?.data?.map((cinema) => (
         <tr key={cinema.id}>
        <td>{cinema.id}</td>
        <td>{cinema.name}</td>
        <td>
            {cinema.location.latitude}
        </td>
        <td>{cinema.contactInfo}</td>
        <td>
          <button
            className="btn btn-edit"
            onClick={() => handleEditCinema(cinema.id)}
          >
            Edit
          </button>
          <button
            className="btn btn-delete"
            onClick={() => handleDelete(cinema.id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ))
  }
</tbody>

      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editMode ? "Edit Cinema" : "Add New Cinema"}</h2>
            <label>
              Name:
              <input
                type="text"
                value={newCinemaName}
                onChange={(e) => setNewCinemaName(e.target.value)}
              />
            </label>
            <label>
              Latitude:
              <input
                type="text"
                value={newCinemaLocation.latitude}
                onChange={(e) =>
                  setNewCinemaLocation((prev) => ({
                    ...prev,
                    latitude: e.target.value,
                  }))
                }
              />
            </label>
            <label>
              Longitude:
              <input
                type="text"
                value={newCinemaLocation.longitude}
                onChange={(e) =>
                  setNewCinemaLocation((prev) => ({
                    ...prev,
                    longitude: e.target.value,
                  }))
                }
              />
            </label>
            <label>
              Contact Info:
              <input
                type="text"
                value={newCinemaContactInfo}
                onChange={(e) => setNewCinemaContactInfo(e.target.value)}
              />
            </label>
            <div className="modal-actions">
              <button className="btn" onClick={handleModalSubmit}>
                Submit
              </button>
              <button className="btn btn-cancel" onClick={handleModalCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cinema;
