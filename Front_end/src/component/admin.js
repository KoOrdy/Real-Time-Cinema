import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosInstance";
import "./AdminPage.css";
import { Link } from "react-router-dom";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Navbara from "./adminnav";

const Vendor = () => {
  const [vendors, setVendors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newVendorUsername, setNewVendorUsername] = useState("");
  const [newVendorEmail, setNewVendorEmail] = useState("");
  const [newVendorPassword, setNewVendorPassword] = useState(""); 
  const [queryVersion, setQueryVersion] = useState(1);
  const token = localStorage.getItem("token");
  const { status, data } = useAuthenticatedQuery({
    queryKey: ["vendors",`${queryVersion}`],
    url:"/admin/vendor",
    config: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
  
console.log(data);


  const handleAddVendor = () => {
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);
      if (!token) {
        alert("Token is missing. Please log in again.");
        return;
      }

      if (!newVendorUsername || !newVendorEmail || !newVendorPassword) {
        alert("Please fill out all fields.");
        return;
      }

      const newVendor = {
        username: newVendorUsername,
        email: newVendorEmail,
        password: newVendorPassword, 
      };

      const { data, status } = await axiosInstance.post("/admin/", newVendor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (status === 201) {
        setVendors((prevVendors) => [...prevVendors, data]);
        alert("Vendor added successfully!");
        setShowModal(false);
        setNewVendorUsername("");
        setNewVendorEmail("");
        setNewVendorPassword(""); 
        setQueryVersion(queryVersion + 1);
      } else {
        alert("Failed to add vendor. Please try again.");
      }
    } catch (error) {
      console.error("Error adding vendor:", error.response || error);
      alert("An error occurred while adding the vendor. Please try again.");
    }
  };

  const handleModalCancel = () => {
    setNewVendorUsername("");
    setNewVendorEmail("");
    setNewVendorPassword(""); 
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    try {
      // Confirm deletion
      const confirmation = window.confirm(
        `Are you sure you want to delete the vendor with ID: ${id}?`
      );
      if (!confirmation) return;
  
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token is missing. Please log in again.");
        return;
      }
  
      // Send DELETE request to the API
      const { status } = await axiosInstance.delete(`/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (status === 200) {

        alert(`Vendor with ID: ${id} has been deleted successfully.`);
        setQueryVersion(queryVersion + 1);
      
      } else {
        alert("Failed to delete the vendor. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting vendor:", error.response || error);
      alert("An error occurred while trying to delete the vendor. Please try again.");
    }
  };
  

  const handleViewCustomers = () => {

  };

  const handleViewReports = () => {
    alert("Viewing reports...");
  };

  return (
    <> <Navbara />    
    <div className="admin-container">
      <h1>Vendor Management</h1>

      <div className="admin-operations">
        <button className="btn" onClick={handleAddVendor}>
          Add Vendor
        </button>
        
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((vendor) => (
            <tr key={vendor.id}>
              <td>{vendor.id}</td>
              <td>{vendor.username}</td>
              <td>{vendor.email}</td>
              <td>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(vendor.id)}
                >
                  Delete
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
            <h2>Add New Vendor</h2>
            <label>
              Username:
              <input
                type="text"
                value={newVendorUsername}
                onChange={(e) => setNewVendorUsername(e.target.value)}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={newVendorPassword}
                onChange={(e) => setNewVendorPassword(e.target.value)}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={newVendorEmail}
                onChange={(e) => setNewVendorEmail(e.target.value)}
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
    </div></>
  );
};

export default Vendor;
