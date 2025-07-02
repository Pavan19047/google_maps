import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function App() {
  const [city, setCity] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!city) return;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: city,
            format: "json",
            limit: 1,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setCoordinates({ lat: parseFloat(lat), lon: parseFloat(lon) });
        setError("");
      } else {
        setError("City not found. Please enter a valid city name.");
        setCoordinates(null);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching location. Try again later.");
      setCoordinates(null);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card sx={{ p: 3, boxShadow: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom>
          City Map Viewer
        </Typography>
        <TextField
          fullWidth
          label="Enter City Name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" fullWidth onClick={handleSearch}>
          Show Map
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Card>

      {coordinates && (
        <Box sx={{ mt: 4 }}>
          <Card sx={{ height: "400px", boxShadow: 4, borderRadius: 4 }}>
            <CardContent sx={{ height: "100%", p: 0 }}>
              <MapContainer
                center={[coordinates.lat, coordinates.lon]}
                zoom={11.5} // Approx for ~50km view
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[coordinates.lat, coordinates.lon]} />
                <Circle
                  center={[coordinates.lat, coordinates.lon]}
                  radius={25000} // 25km radius, 50km diameter
                  pathOptions={{ color: "blue", fillOpacity: 0.2 }}
                />
              </MapContainer>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
}

export default App;
