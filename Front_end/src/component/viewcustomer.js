import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosInstance";
import "./AdminPage.css";
import { Link } from "react-router-dom";
import Navbara from "./adminnav";

const Viewcustomer = () => {
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Retrieve token from localStorage
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);
        if (!token) {
          alert("Token is missing. Please log in again.");
          return;
        }

        // Fetch customers from the backend
        const { data, status } = await axiosInstance.get("/admin/customer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (status === 200) {
          setCustomers(data); // Update customers state
          console.log("Fetched customers:", data);
        } else {
          alert("Failed to fetch customers");
        }
      } catch (error) {
        console.error("Error fetching customers:", error.response || error);
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    try {
      // Confirm deletion
      const confirmation = window.confirm(
        `Are you sure you want to delete the customer with ID: ${id}?`
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
        // Update state to remove the deleted customer
        setCustomers((prevCustomers) =>
          prevCustomers.filter((customer) => customer.id !== id)
        );
        alert(`Customer with ID: ${id} has been deleted successfully.`);
      } else {
        alert("Failed to delete the customer. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting customer:", error.response || error);
      alert("An error occurred while trying to delete the customer. Please try again.");
    }
  };
  

 

  const handleViewvendors = () => {
  
  };

  const handleViewReports = () => {
    alert("Viewing reports...");
  };

  return (
    <><Navbara />
    <div className="admin-container">
      <h1>Admin Page</h1>
    
    

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
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.username}</td>
              <td>{customer.email}</td>
              <td>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(customer.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div></>
  );
};

export default Viewcustomer;
