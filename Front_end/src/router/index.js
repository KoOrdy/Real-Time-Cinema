import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Home from "../component/home";
import Login from "../forms/login";
import MoviesPage from "../component/movies";
import Cinema from "../component/cinemas";
import Vendor from "../component/admin";
import Register from "../forms/register";
import Viewcustomer from "../component/viewcustomer";
import MapPag from "../component/mapcomp";
import Updatecinema from "../component/updatecinema";
import UserInfo from "../component/userinfo";
import ProtectedRoute from "../component/ProtectedRoute";
import ResetPassword from "../forms/resetpassword";
import Dashboard from "../component/viewreports";
import AboutUs from "../component/about";
import MyBookings from "../component/mybooking";
import VMovies from "../component/vendormovies";
import Halls from "../component/halls";
import MapPag2 from "../component/updatecinema";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const router = createBrowserRouter(


  createRoutesFromElements(


    <>
      <Route path="/">
        {/* Home Route */}
        
        <Route index element={

          <MapPag />
          
          }/>

<Route path="/login" element={
  <ProtectedRoute isAllowed={!token} redirectPath={"/"}>
    <Login />
  </ProtectedRoute>
} />
        <Route path="/moviepage" element={<MoviesPage />} />

  

        <Route path="/vendors" element={<Vendor />} />

        <Route path="/register" element={<Register />} />

        <Route path="/viewcustomer" element={<Viewcustomer />} />

        <Route path="/updatecinema" element={<MapPag2 />} />

        <Route path="/lastadded/:id" element={<Home/>}/>

        {/* <Route path="/mybooking" element={<MyBookings/>}/> */}

        <Route path="/userinfo" element={<UserInfo/>}/>

        <Route path="/cinemas" element={<Cinema />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/viewreports" element={<Dashboard />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/mybooking" element={<MyBookings />} />
        <Route path="/:cinemaId/halls" element={<Halls />} />        

        <Route path="/movies/:cinemaId" element={<VMovies />} />

         <Route path="/viewreports" element={<Dashboard />} />
      


       
      </Route>
      
    </>
  )
);

export default router;