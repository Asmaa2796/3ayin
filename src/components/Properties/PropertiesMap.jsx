import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import "./property.css"; // styles below
import { useTranslation } from "react-i18next";
import Breadcrumb from "../Breadcrumb/Breadcrumb";

const CATEGORY_TYPES = ["all", "sale", "rent", "share"];

const CATEGORY_COLORS = {
  all: "#9b59b6", // purple
  sale: "#e74c3c", // red
  rent: "#3498db", // blue
  share: "#2ecc71", // green
};

const createCategoryIcon = (category) => {
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.all;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/>
      <circle cx="12" cy="10" r="3" fill="white"/>
    </svg>
  `;

  return L.divIcon({
    className: "custom-marker",
    html: svg,
    iconSize: [30, 40],
    iconAnchor: [15, 40], // bottom center
    popupAnchor: [0, -40],
  });
};

const hasValidCoords = (p) =>
  p?.latitude !== null &&
  p?.longitude !== null &&
  !isNaN(Number(p.latitude)) &&
  !isNaN(Number(p.longitude));

const PropertiesMap = () => {
  const { t, i18n } = useTranslation("global");
  const [filter, setFilter] = useState("all");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mapRef = useRef(null);

  // Fetch by type (server-side)
  const fetchByType = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const base = process.env.REACT_APP_BASE_URL || ""; // ensure env var is set
      const url = `${base}/api/properties?type=${encodeURIComponent(type)}`;
      const res = await axios.get(url);
      const list = (res.data && res.data.data) || [];

      // keep only items with valid coords
      const filtered = list.filter(hasValidCoords);
      setProperties(filtered);

      // fit to markers after a small delay (ensures mapRef exists)
      setTimeout(() => {
        if (mapRef.current && filtered.length > 0) {
          const coords = filtered.map((p) => [
            Number(p.latitude),
            Number(p.longitude),
          ]);
          const bounds = L.latLngBounds(coords);
          try {
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
          } catch (e) {
            // fallback: setView to first marker
            mapRef.current.setView(coords[0], 12);
          }
        } else if (mapRef.current && filtered.length === 0) {
          // no markers — set default center/zoom
          mapRef.current.setView([30.0444, 31.2357], 6);
        }
      }, 200);
    } catch (err) {
      console.error("fetch properties error:", err);
      setError(t("failed_to_load_properties"));
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // fetch when filter changes (and on mount)
  useEffect(() => {
    fetchByType(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const center = [30.0444, 31.2357]; // fallback center (Cairo)

  return (
    <>
      <Breadcrumb title={t("property.maps")} />
      <div className="properties-map-wrapper">
        <div className="filters-row py-3 mb-0">
          {CATEGORY_TYPES.map((type) => (
            <button
              key={type}
              className={`filter-btn ${filter === type ? "active" : ""}`}
              onClick={() => setFilter(type)}
              disabled={loading && filter === type}
            >
              {t(`property.${type}`)}
            </button>
          ))}
        </div>
        <div className="map-footer my-2">
          {loading && <div className="map-status">{t("loading")}</div>}
          {error && <div className="map-error">{error}</div>}
          {!loading && !error && (
            <div className="map-status">
              {properties.length} {t("properties_shown")}
            </div>
          )}
        </div>
        <div className="map-container">
          <MapContainer
            center={center}
            zoom={12}
            style={{ height: "500px", width: "100%" }}
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            />

            {properties.map((p) => (
              <Marker
                key={p.id}
                position={[Number(p.latitude), Number(p.longitude)]}
                icon={createCategoryIcon(p.category)}
              >
                <Popup>
                  <div style={{ minWidth: 160 }}>
                    <strong>
                      {t("property.unitCategory")} :{" "}
                      {i18n.language === "ar" ? p.title_ar : p.title_en}
                    </strong>
                    <br />
                    {t("property.unitCategory")} : {t(`property.${p.category}`)}
                    <br />
                    {t("create_ad.location")} : {p.location}
                    <br />
                    {t("create_ad.price")} : {p.price}{" "}
                    {t("recommendedServices.currency")}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default PropertiesMap;
