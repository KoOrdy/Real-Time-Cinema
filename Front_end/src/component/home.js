import React from "react"; // Import React if required (not mandatory with React 17+)
import Navbar from "./navbar";
import Slider from "./slider";
import Lastadded from "./lastadded";
import "./home.css"


const Home = () => {
  return (
    <div className="home_page">
<Navbar/>
      <Slider />
      <Lastadded />
   </div>
  );
};

export default Home;
