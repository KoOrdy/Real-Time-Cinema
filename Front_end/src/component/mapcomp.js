import { useEffect, useState } from "react";
import MapContainer from "./MapContainer";
import axiosInstance from "../config/axiosInstance";

const MapPag = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const containerStyle = {
    width: "100%",
    height: "800px",
  };

  const coordinates = { lat: 50.973, lng: 50.1325 }; // Default map center

  const handleMarkerClick = (cinemaId) => {
    localStorage.setItem("selectedCinemaId", cinemaId);
    console.log(`Cinema ID ${cinemaId} saved in local storage.`);
  };

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await axiosInstance.get("/customer/cinemas");

        console.log("Full Response:", response);
        console.log("Response Data:", response.data);

        if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
          throw new Error("Unexpected API response format.");
        }

        const cinemas = response.data.data;

        const formattedLocations = cinemas.map((cinema) => ({
          latitude: parseFloat(cinema.location.latitude),
          longitude: parseFloat(cinema.location.longitude),
          cinemaLink: "/", // Modify this as needed
          cinemaId: cinema.id,
        }));

        setLocations(formattedLocations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cinema locations:", error);
      }
    };

    fetchCinemas();
  }, []);

  return (
    <div>
      {!loading ? (
        <MapContainer
          mapContainerStyle={containerStyle}
          coordinates={coordinates}
          locations={locations}
          onMarkerClick={handleMarkerClick}
        />
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default MapPag;
