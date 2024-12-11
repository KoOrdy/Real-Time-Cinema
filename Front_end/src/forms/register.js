import { Link } from "react-router-dom";
import { useState } from "react";
import "./login.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from "../config/axiosInstance";


const Register= () =>{
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");  
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [phonenum, setPhonenum] = useState("");
   
   
    const formSubmitHandler = async (e) => {
        e.preventDefault(); 
        if (username.trim() === "") return toast.error("username required");
        if (email.trim() === "") return toast.error("email required");
        if (password.trim() === "") return toast.error("password required");
        if (password.trim().length < 8) {return toast.error("Password must be at least 8 characters.");}    
        if (password2.trim() === "") return toast.error("confirm your password");
        if(password != password2)return toast.error("Your password don't match")
        if (phonenum.trim() === "") return toast.error("phone Number required");
        if (phonenum.trim().length < 11) {return toast.error("phone Number must be at least 11 digit.");}   
      
        console.log({ username,email, password, password2 ,phonenum  });
        try {
            const { status } = await axiosInstance.post("/register", { username,email, password ,"phone": phonenum });
            
            if (status == 201) {
              toast.success("You will navigate to the home page after 2 seconds.",
                {
                  position: "bottom-center",
                  duration: 2000,
                  style: {backgroundColor: "black", color: "white", width: "fit-content",},
                }
              );

            }
          } catch (error) {
            console.log(error);
            
            toast.error("signup failed",
              {
                position: "bottom-center",
                duration: 4000,
                style: {backgroundColor: "black", color: "white", width: "fit-content",},
              }
            );
        } 
    };

    return (
        <div className="login-wrapper">
                <ToastContainer/>
            <form className="login" onSubmit={formSubmitHandler}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    name="username"
                    onChange={(e) => setUsername(e.target.value)} 
                />
                   <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    name="password"
                    onChange={(e) => setPassword(e.target.value)} 
                />
                  <input
                    type="password"
                    placeholder="confirm Password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)} 
                />
                  <input
                    type="number"
                    placeholder="phone number"
                    value={phonenum}
                    name="phone"
                    onChange={(e) => setPhonenum(e.target.value)} 
                />
            
                <button className="login-btn" type="submit">
                   Sign Up
                </button>
                <div className="login-footer">
                    Already have an account? <Link to="/">Login</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;

