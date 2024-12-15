import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosInstance"; // Adjust the import as per your project structure
import "./userinfo.css";
import { toast } from "react-toastify";
import Navbar from "./navbar";

const UserInfo = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ ...user, password: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/customer/userInfo");
        if (response.data && response.data.data) {
          const { username, email, phone } = response.data.data;
          setUser({ username, email, phone });
          setFormData({ username, email, phone, password: "" });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setError("Failed to load user information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleEditClick = () => {
    setFormData({ ...user, password: "" });
    setEditMode(true);
  };

  const handleChangePasswordClick = () => {
    setPasswordData({ oldPassword: "", newPassword: "" });
    setChangePasswordMode(true);
  };

  const handleCloseModal = () => {
    setEditMode(false);
    setChangePasswordMode(false);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "phone") {
      if (value.length > 11) {
        setError("Phone number must be exactly 11 digits");
      } else if (value.length < 11) {
        setError("Phone number must be 11 digits");
      } else {
        setError("");
      }
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { email, phone, password } = formData;

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Email must be valid");
      return false;
    }

    if (phone.length !== 11) {
      setError("Phone number must be exactly 11 digits");
      return false;
    }

    if (password && password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    setError("");
    return true;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        const response = await axiosInstance.patch("/customer/updateInfo", {
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          ...(formData.password && { password: formData.password }),
        });

        if (response.data && response.data.message === "Success") {
          // Immediately update the user state with the new data (real-time update)
          setUser(formData);
          setEditMode(false);
          toast.success("Information updated successfully");
        } else {
          toast.error("Failed to update information");
        }
      } catch (error) {
        console.error("Error updating user info:", error);
        toast.error("An error occurred while updating your information");
      } finally {
        handleCloseModal(); // Close the modal after saving or error
      }
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    try {
      const response = await axiosInstance.post("/changePassword", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data && response.data.message === "Success") {
        setChangePasswordMode(false);
        toast.success("Password changed successfully");
      } else {
        toast.error(response.data?.error || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred while changing your password");
    } finally {
      handleCloseModal(); // Close the modal after password change or error
    }
  };

  if (loading) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className="user-info">
      <Navbar />
      <h1>User Information</h1>
      <div className="info-container">
        <p>
          <strong>Username:</strong>
          <span>{user.username}</span>
        </p>
        <p>
          <strong>Email:</strong>
          <span>{user.email}</span>
        </p>
        <p>
          <strong>Phone:</strong>
          <span>{user.phone}</span>
        </p>
        <div className="buttons-container">
          <button className="edit-button" onClick={handleEditClick}>
            Edit
          </button>
          <button
            className="change-password-button"
            onClick={handleChangePasswordClick}
          >
            Change Password
          </button>
        </div>
      </div>

      {editMode && (
        <div className="modal">
          <div className="edit-user-info">
            <form>
              <label>
                Username
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
              <label>
                Phone
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength="11"
                />
              </label>
              {error && <div className="error">{error}</div>}
              <div className="buttons">
                <button
                  type="button"
                  className="save-button"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {changePasswordMode && (
        <div className="modal">
          <div className="edit-user-info">
            <form>
              <label>
                Old Password
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                />
              </label>
              <label>
                New Password
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  minLength="8"
                />
              </label>
              {error && <div className="error">{error}</div>}
              <div className="buttons">
                <button
                  type="button"
                  className="save-button"
                  onClick={handleChangePassword}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;