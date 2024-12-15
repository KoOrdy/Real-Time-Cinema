import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../config/axiosInstance";
import "./login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const formSubmitHandler = async (e) => {
        e.preventDefault(); 

        if (username.trim() === "") return toast.error("Username is required");
        if (password.trim() === "") return toast.error("Password is required");

        try {
            const response = await axiosInstance.post("/login", {
                username,
                password,
            });
    
            if (response.status === 200) {
                const { token } = response.data; 
                toast.success("Login successful!");
                localStorage.setItem("token", token); 
                localStorage.setItem("role",  response.data.role); 

                console.log("Token:", token);
                console.log( response.data);
                
                if ( response.data.role == "customer") {
                    navigate("/")
                }
                                
                if ( response.data.role == "admin") {
                    navigate("/viewreports")
                }
                                              
                if ( response.data.role == "vendor") {
                    navigate("/cinemas")
                }
            } else {
           
                toast.error("Login failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during login");
            console.log(error)
        }
    };

    return (
        <div className="login-wrapper">
            
            <ToastContainer />
            <form className="login" onSubmit={formSubmitHandler}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button className="login-btn" type="submit">
                    Login
                </button>
                <div className="login-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
                <div className="login-footer">
                Forgot password?<Link to="/reset-password">Reset Password</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;