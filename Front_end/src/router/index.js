import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Home from "../component/home";
import Login from "../forms/login";
import MoviesPage from "../component/movies";
import Cinema from "../component/cinemas";
import Vendor from "../component/admin";
import Register from "../forms/register";
import Viewcustomer from "../component/viewcustomer";
import Updatecinema from "../component/updatecinema";






const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" >
        {/* Home Route */}
        <Route index element={<Home />} />

        <Route 
          path="/login" 
          element={<Login/>} 
         />

        <Route 
          path="/moviepage" 
          element={<MoviesPage/>} 
         />
      
      <Route 
          path="/cinemas" 
          element={<Cinema/>} 
         />
         <Route 
          path="/vendors" 
          element={ <Vendor/>} 
         />
          <Route 
          path="/register" 
          element={ <Register/>} 
         />
           <Route 
          path="/viewcustomer" 
          element={ <Viewcustomer/>} 
         />
           <Route 
          path="/updatecinema" 
          element={ <Updatecinema/>} 
         />
         
        
      </Route>

      
    </>
  )
)

export default router;
