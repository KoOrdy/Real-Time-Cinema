import { useEffect, useState } from "react";
import axiosInstance from "../config/axiosInstance";

const MapPag2 = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCinemaClick = (cinemaId) => {
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

        // No need for map coordinates, just display the cinema names or details
        const formattedLocations = cinemas.map((cinema) => ({
          cinemaName: cinema.name, // Add the name or any relevant info you want to show
          cinemaLink: `/lastadded/${cinema.id}`, 
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
        <div>
          <h2>Cinemas List</h2>
          <ul>
            {locations.map((cinema) => (
              <li key={cinema.cinemaId}>
                <a href={cinema.cinemaLink} onClick={() => handleCinemaClick(cinema.cinemaId)}>
                  {cinema.cinemaName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading cinemas...</p>
      )}
    </div>
  );
};

export default MapPag2;