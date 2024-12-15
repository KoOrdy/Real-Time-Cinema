import { toast } from "react-toastify";
import "./navbar.css"
import { NavLink } from "react-router-dom";

const Navbar=()=>{
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

return(
    <nav className="navbar">
        <ul className="navbar-links">
        <li className="navbar-link">
             <NavLink  className="navbar-link" to="/">HOME</NavLink>
              </li>
            <li className="navbar-link">
            <NavLink className="navbar-link" to="/aboutus">About Us</NavLink> 
              </li>
            <li className="navbar-link">
           <NavLink className="navbar-link" to="/mybooking">My Booking</NavLink> 
              </li>
            <li className="navbar-link">
             <NavLink  className="navbar-link" to="/userinfo">Profile</NavLink>
              </li>
            {localStorage.getItem("token") ? (
          <li className="navbar-link">
            <button className="btn" type="button" onClick={onLogout}>logout</button>
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