import { toast } from "react-toastify";
import "./navbar.css"
import { NavLink } from "react-router-dom";

const Navbar=()=>{
    const onLogout = () => {
        localStorage.removeItem("token");
        toast.success("You will navigate to the login page after 2 seconds.",
          {
            position: "bottom-center",
            duration: 2000,
            style: {backgroundColor: "black", color: "white", width: "fit-content",},
          }
        );
        setTimeout(function() {
            window.location.replace("/");
          }, 2000);
      }
  
return(
    <nav className="navbar">
        <ul className="navbar-links">
            <li className="navbar-link">Home</li>
            <li className="navbar-link">About Us</li>
            <li className="navbar-link">Movies</li>
            <li className="navbar-link">Profile</li>
            {localStorage.getItem("token") ? (
          <li className="navbar-link">
            <button type="button" onClick={onLogout}>logout</button>
          </li>
        ):(
          <li className="navbar-link">
            <NavLink to="/login">login</NavLink>
          </li>
        )}
        </ul>


    </nav>

)
}
export default Navbar;