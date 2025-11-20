import React, { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 30.0444, lng: 31.2357 }; // Cairo

const GoogleMapPicker = ({ onSelect }) => {
  const [selected, setSelected] = useState(null);
  const { t, i18n } = useTranslation("global");
  const autocompleteRef = useRef(null);

  // ✅ language removed from loader — fixed once
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAHQSuklfkVa-mATYvbA7odk3_LpnKG-OA",
    libraries: ["places"],
    region: "EG",
  });

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const location = place.formatted_address || place.name;
        setSelected({ lat, lng });
        onSelect({ latitude: lat, longitude: lng, location });
      }
    }
  };

  const onMapClick = useCallback(
  async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setSelected({ lat, lng });

    try {
      // 🔹 Reverse geocode clicked point
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAHQSuklfkVa-mATYvbA7odk3_LpnKG-OA&language=${i18n.language}`
      );
      const data = await res.json();

      const location =
        data.results?.[0]?.formatted_address || `${lat}, ${lng}`;

      // 🔹 Send back full data to parent
      onSelect({ latitude: lat, longitude: lng, location });
    } catch (error) {
      console.error("Reverse geocode failed:", error);
      onSelect({ latitude: lat, longitude: lng, location: "" });
    }
  },
  [onSelect, i18n.language]
);


  if (!isLoaded) return <p>{t("loading_map")}...</p>;

  return (
    <div>
      {/* 🔹 Search input with re-render on language change */}
      <div className="d-flex mb-2 align-items-center" style={{ maxWidth: 400 }}>
        <Autocomplete
          key={i18n.language} // force rebuild input when language changes
          onLoad={(ac) => (autocompleteRef.current = ac)}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            placeholder={t("search_place")}
            className="form-control"
            style={{ width: "100%" }}
          />
        </Autocomplete>
      </div>

      {/* 🔹 Map */}
      <GoogleMap
        key={i18n.language} // re-render map to refresh UI labels
        mapContainerStyle={containerStyle}
        center={selected || defaultCenter}
        zoom={selected ? 16 : 12}
        onClick={onMapClick}
        options={{
          // custom map language UI (not script-level)
          mapTypeControl: true,
          streetViewControl: true,
        }}
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapPicker;
