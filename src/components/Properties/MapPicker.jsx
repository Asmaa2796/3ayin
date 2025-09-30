import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";

// fix default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function LocationMarker({ onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);

      // reverse geocode
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`
      )
        .then((res) => res.json())
        .then((data) => {
          onSelect({
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
            location: data.display_name || "",
          });
        });
    },
  });

  return position ? <Marker position={position} /> : null;
}

const MapPicker = ({ onSelect, lang = "en" }) => {
  const [search, setSearch] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;

    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: search });

    if (results.length > 0) {
      const { y: lat, x: lng, label } = results[0];
      onSelect({
        latitude: lat,
        longitude: lng,
        location: label,
      });
    }
  };

  return (
    <div>
      {/* 🔹 Custom search input */}
      <div className="d-flex mb-2 align-items-center" style={{ maxWidth: "400px" }}>
        <input
          type="text"
          className="form-control"
          placeholder={lang === "ar" ? "ابحث عن العنوان..." : "Search address..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          dir={lang === "ar" ? "rtl" : "ltr"}
        />
        <button
          type="button"
          className="mx-1"
          style={{fontSize:"16px"}}
          onClick={handleSearch}
        >
          {lang === "ar" ? "بحث" : "Search"}
        </button>
      </div>

      {/* 🔹 Map */}
      <MapContainer
        center={[30.0444, 31.2357]} // Cairo default
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker onSelect={onSelect} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
