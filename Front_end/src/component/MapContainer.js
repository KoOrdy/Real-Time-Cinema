import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const MapContainer = ({ coordinates, mapContainerStyle, locations, onMarkerClick }) => {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBNlTpKQUSKdcM9skmPcEKj2_--4tOAaP4", 
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={coordinates}
      zoom={8} 
    >

      {locations.length > 0 ? (
        locations.map((cinema) => (
          <Marker
            key={cinema.cinemaId}
            position={{ lat: cinema.latitude, lng: cinema.longitude }}
            onClick={() => {

              onMarkerClick(cinema.cinemaId); 
              navigate(cinema.cinemaLink); 
            }}
          />
        ))
      ) : (
        <p>No cinema locations available.</p>
      )}
    </GoogleMap>
  ) : (
    <p>Loading map...</p> 
  );
};

export default MapContainer;