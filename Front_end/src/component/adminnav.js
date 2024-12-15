import { toast } from "react-toastify";
import "./navbar.css"
import { NavLink } from "react-router-dom";

const Navbara=()=>{
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
             <NavLink  className="navbar-link" to="/viewreports">Dashboard</NavLink>
              </li>
            <li className="navbar-link">
            <NavLink className="navbar-link" to="/vendors">Vendor Management</NavLink> 
              </li>
            <li className="navbar-link">
           <NavLink className="navbar-link" to="/viewcustomer">Customer Management</NavLink> 
              </li>
            <li className="navbar-link">
             <NavLink  className="navbar-link" to="/">View Cinemas</NavLink>
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
export default Navbara;