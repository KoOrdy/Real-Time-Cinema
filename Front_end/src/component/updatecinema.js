import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosInstance";
import "./AdminPage.css";
import { Link } from "react-router-dom";


const Updatecinema = () => {
  const [cinemas, setCinemas] = useState([]);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);
        if (!token) {
          alert("Token is missing. Please log in again.");
          return;
        }

        const { data, status } = await axiosInstance.get("/admin/movies/:cinemaId", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (status === 200) {
          setCinemas(data);
          console.log(data);
        } else {
          alert("Failed to fetch cinemas.");
        }
      } catch (error) {
        console.error("Error fetching cinemas:", error.response || error);
      }
    };

    fetchCinemas();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [editCinemaId, setEditCinemaId] = useState(null);
  const [editCinemaName, setEditCinemaName] = useState("");
  const [editCinemaEmail, setEditCinemaEmail] = useState("");

  const handleEdit = (id) => {
    const cinemaToEdit = cinemas.find((cinema) => cinema.id === id);
    if (cinemaToEdit) {
      setEditCinemaId(cinemaToEdit.id);
      setEditCinemaName(cinemaToEdit.name);
      setEditCinemaEmail(cinemaToEdit.email);
      setShowModal(true); // Show modal with cinema details
    }
  };
  
  const handleModalSubmit = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token is missing. Please log in again.");
        return;
      }
  
      if (!editCinemaName || !editCinemaEmail) {
        alert("Please fill out all fields.");
        return;
      }
  
      // Send the updated data to the server
      const updatedCinema = {
        name: editCinemaName,
        email: editCinemaEmail,
      };
  
      const { status } = await axiosInstance.put(`/admin/movies/${editCinemaId}`, updatedCinema, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (status === 200) {
        setCinemas(
          cinemas.map((cinema) =>
            cinema.id === editCinemaId
              ? { ...cinema, name: editCinemaName, email: editCinemaEmail }
              : cinema
          )
        );
        setShowModal(false); // Close modal
        alert("Cinema details updated successfully!");
      } else {
        alert("Failed to update cinema details. Please try again.");
      }
    } catch (error) {
      console.error("Error updating cinema details:", error.response || error);
      alert("An error occurred while updating the cinema details. Please try again.");
    }
  };
  
  const handleModalCancel = () => {
    setEditCinemaId(null);
    setEditCinemaName("");
    setEditCinemaEmail("");
    setShowModal(false); // Close modal without saving changes
  };
  

  const handleViewReports = () => {
    alert("Viewing reports...");
  };

  const handleViewCinemas = () => {
    alert("Viewing all cinemas...");
  };

  const handleViewVendors = () => {
    alert("Viewing all vendors...");
  };

  const handleViewCustomers = () => {
    alert("Viewing all customers...");
  };

  return (
    <div className="admin-container">
      <h1>Admin Page</h1>

      <div className="admin-operations">
        <Link to="/"className="btn" onClick={handleViewVendors}>
          View Vendors
        </Link>
        <button className="btn" onClick={handleViewCustomers}>
          View Customers
        </button>
        <button className="btn" onClick={handleViewReports}>
          View Reports
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cinemas.map((cinema) => (
            <tr key={cinema.id}>
              <td>{cinema.id}</td>
              <td>{cinema.name}</td>
              <td>{cinema.email}</td>
              <td>
                <button
                  className="btn btn-edit"
                  onClick={() => handleEdit(cinema.id)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Cinema Details</h2>
            <label>
              Name:
              <input
                type="text"
                value={editCinemaName}
                onChange={(e) => setEditCinemaName(e.target.value)}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={editCinemaEmail}
                onChange={(e) => setEditCinemaEmail(e.target.value)}
              />
            </label>
            <div className="modal-actions">
              <button className="btn" onClick={handleModalSubmit}>
                Save
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

export default Updatecinema;
