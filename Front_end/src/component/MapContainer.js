import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";

const MapContainer = ({ coordinates, mapContainerStyle, mainLocation }) => {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBNlTpKQUSKdcM9skmPcEKj2_--4tOAaP4", 
  });

  const [cinemas, setCinemas] = useState([]);

  
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await axiosInstance.get("/customer/cinemas");
        setCinemas(response.data); 
      } catch (error) {
        console.error("Error fetching cinemas:", error);
      }
    };

    fetchCinemas();
  }, []);

  const handleMarkerClick = (cinemaId) => {
   
    localStorage.setItem("selectedCinemaId", cinemaId);
      navigate("/"); 
  };

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={coordinates}
        zoom={8}
      >
        {mainLocation && (
          <Marker
            position={mainLocation}
          />
        )}
        {cinemas.map((cinema) => (
          <Marker
            key={cinema.id}
            position={{
              lat: parseFloat(cinema.location.latitude),
              lng: parseFloat(cinema.location.longitude),
            }}
            onClick={() => handleMarkerClick(cinema.id)} 
          />
        ))}
      </GoogleMap>
    </>
  ) : (
    <></>
  );
};

export default MapContainer;
