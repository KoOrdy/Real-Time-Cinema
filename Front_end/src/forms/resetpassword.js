import { useState } from "react";
import axiosInstance from "../config/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./resetpassword.css";
import { Link, Links } from "react-router-dom";

const ResetPassword = () => {
    const [email, setEmail] = useState("");

    const formSubmitHandler = async (e) => {
        e.preventDefault();
    
        if (email.trim() === "") return toast.error("Email is required");
    
        try {
            const response = await axiosInstance.post("/resetpassword", { email }); 
    
            if (response.status === 200) {
                toast.success("Reset password email sent! Check your inbox.");
            } else {
                toast.error("Failed to send reset password email.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while sending reset email");
            console.log(error);
        }
    };

    return (
        <div className="reset-password-wrapper">
            <ToastContainer />
            <form className="reset-password" onSubmit={formSubmitHandler}>
                <h2>Reset Password</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button className="reset-btn" type="submit">
                    Send Reset Link
                </button>
                <Link to="/login" className="reset-btn" type="submit">
                    GO TO LOGIN
                </Link>
            </form>
        </div>
    );
};

export default ResetPassword;
