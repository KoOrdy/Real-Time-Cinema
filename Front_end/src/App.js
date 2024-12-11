import React from 'react';
import './App.css';
import Login from "./forms/login";
import Register from "./forms/register";
import { BrowserRouter as Router, Routes, Route, RouterProvider } from "react-router-dom";
import Navbar from "./component/navbar";
import Slider from "./component/slider";
import Lastadded from "./component/lastadded";
import lastAddedData from "./lastAdded.json";
import Vendor from "./component/admin"
import Viewcustomer from "./component/viewcustomer"
import Updatecinema from "./component/updatecinema"
import MoviesPage from "./component/movies"
import Home from "./component/home"
import Cinema from "./component/cinemas"
import router from './router';



const App = () => {
  return (
   
    <div className="App">
    {/* <Router>
      <Routes>
     
      
         <Route path="/updatecustomer" element={<Updatecinema />} />  
      </Routes>
    </Router> */}
 
  
   {/* <Updatecinema/> */}
  


   <RouterProvider router={router} />

    </div>
 
  );
}

export default App;
