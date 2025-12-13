import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import "./property.css";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { Link } from "react-router-dom";

// Dynamic marker icon based on purpose color
const createPropertyIcon = (property) => {
  const color = property?.purpose?.color || "#993333"; // fallback
  const hasVR = property?.AR_VR ? true : false; // boolean check
  const vrHtml = hasVR
    ? `<img src="/vr-glasses.png" style="width:16px;height:16px;position:absolute;top:-4px;right:-4px;z-index:1000;" alt="VR"/>`
    : "";

  const svg = `
    <div style="position:relative;">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/>
        <circle cx="12" cy="10" r="3" fill="white"/>
      </svg>
      ${vrHtml}
    </div>
  `;

  return L.divIcon({
    className: "custom-marker",
    html: svg,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });
};

// Simple check for valid coordinates
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
  const [userLocation, setUserLocation] = useState(null);

  const mapRef = useRef(null);
  const [purposes, setPurposes] = useState([]);

  useEffect(() => {
    axios.get("https://app.xn--mgb9a0bp.com/api/property/purposes", {
      headers: {
        "Content-Type": "application/json",
        Lang: i18n.language,
      }
    })
      .then(res => {
        if (res.data?.code === 200) setPurposes(res.data.data);
      })
      .catch(console.error);
  }, [i18n.language]);


  // Fit map bounds to markers
  const fitMapToMarkers = (list) => {
    setTimeout(() => {
      if (mapRef.current && list.length > 0) {
        const coords = list.map((p) => [Number(p.latitude), Number(p.longitude)]);
        const bounds = L.latLngBounds(coords);
        try {
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        } catch {
          mapRef.current.setView(coords[0], 12);
        }
      } else if (mapRef.current) {
        mapRef.current.setView([30.0444, 31.2357], 6); // fallback Cairo
      }
    }, 200);
  };

  // Fetch properties by type
  const fetchByType = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const base = process.env.REACT_APP_BASE_URL || "";
      const url = `${base}/api/properties?type=${encodeURIComponent(type)}`;
      const res = await axios.get(url, { headers: { Lang: i18n.language } });
      const list = (res.data && res.data.data) || [];
      const filtered = list.filter(hasValidCoords);
      setProperties(filtered);
      fitMapToMarkers(filtered);
    } catch (err) {
      console.error(err);
      setError(t("failed_to_load_properties"));
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch nearby properties based on user location
  const fetchNearbyProperties = async (lat, lng) => {
    setLoading(true);
    setError(null);
    try {
      const base = process.env.REACT_APP_BASE_URL || "";
      const url = `${base}/api/near/properties?lat=${lat}&lng=${lng}`;
      const res = await axios.get(url, { headers: { Lang: i18n.language } });
      const list = (res.data && res.data.data) || [];
      const filtered = list
        .filter(hasValidCoords)
        .filter((p) => filter === "all" || String(p?.purpose_id) === String(filter));
      setProperties(filtered);
      setProperties(filtered);
      fitMapToMarkers(filtered);
    } catch (err) {
      console.error(err);
      setError(t("failed_to_load_properties"));
    } finally {
      setLoading(false);
    }
  };

  // Detect user location
  const detectUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearbyProperties(latitude, longitude);
        },
        () => {
          fetchByType(filter); // fallback
        }
      );
    } else {
      fetchByType(filter); // fallback
    }
  };

  // On mount and filter/lang change
  useEffect(() => {
    if (userLocation) {
      fetchNearbyProperties(userLocation.lat, userLocation.lng);
    } else {
      detectUserLocation();
    }
  }, [filter, i18n.language]);

  const center = [30.0444, 31.2357]; // fallback Cairo

  const userIcon = L.divIcon({
    html: `<div style="width:16px;height:16px;background:#007bff;border-radius:50%;border:2px solid white;"></div>`,
    iconSize: [16, 16],
    className: "user-location-marker",
  });
  const filteredProperties = filter === "all"
    ? properties
    : properties.filter(p => String(p.purpose_id) === String(filter));
  return (
    <>
      <Breadcrumb title={t("property.maps")} />
      <div className="properties-map-wrapper">
        <div className="filters-row py-3 mb-0">
          <button
            key="all"
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            {t("property.all")}
          </button>

          {purposes.map((purpose) => (
            <button
              key={purpose.id}
              className={`filter-btn ${filter === String(purpose.id) ? "active" : ""}`}
              onClick={() => setFilter(String(purpose.id))}
            >
              {purpose.name}
            </button>
          ))}
        </div>
        <div className="map-footer my-2">
          {loading && <div className="map-status">{t("loading")}</div>}
          {error && <div className="map-error">{t("failed_to_load_properties")}</div>}
        </div>
        <div className="map-container">
          <MapContainer
            center={center}
            zoom={12}
            style={{ height: "500px", width: "100%" }}
            whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
          >
            {/* Tile layer depending on selected language */}
            {i18n.language === "en" ? (
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles © Esri — Source: Esri, HERE, Garmin, FAO, NOAA, USGS'
              />
            ) : (
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              />
            )}

            {/* Property markers */}
            {filteredProperties.map((p) => (
              <Marker
                key={p?.id}
                position={[p?.latitude, p?.longitude]}
                icon={createPropertyIcon(p)}
              >
                <Popup>
                  <div style={{ minWidth: 160 }}>
                    {p?.AR_VR && (
                      <>
                        <Link
                          className="d-block text-center position-absolute"
                          target="_blank"
                          rel="noopener noreferrer"
                          to={p?.AR_VR}
                          style={{ left: i18n.language === "ar" ? "20px" : "unset", right: i18n.language === "ar" ? "unset" : "20px", top: "10px" }}
                        >
                          <img src="/vr-glasses.png" style={{ width: "auto", maxHeight: "20px" }} alt="--" />
                          <small className="fw-bold main-color d-block mb-2 text-center" style={{ fontSize: "8px" }}>
                            VR/AR
                          </small>
                        </Link>
                      </>
                    )}
                    <strong>{t("property.unitName")} : {p?.title}</strong>
                    <br />
                    {p?.purpose?.name && (
                      <>
                        {t("property.purpose")} : {p?.purpose.name}
                        <br />
                      </>
                    )}
                    <br />
                    <small>{t("create_ad.description")}: {p.description ? p.description : t("labels.undefined")}</small>

                    {t("create_ad.location")} : {p?.location || "—"}
                    <br />
                    {t("create_ad.price")} : {p?.price ? `${p?.price} ${t("recommendedServices.currency")}` : t("labels.currency")}
                    <div>
                      <Link to={`/propertyDetails/${p?.id}`}>
                        {t("property.property_details")} <i
                          style={{ fontSize: "10px" }}
                          className={`bi ${i18n.language === "ar" ? "bi-chevron-left" : "bi-chevron-right"
                            }`}
                        ></i>
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}


            {/* User marker */}
            {userLocation && (
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={userIcon}
              >
                <Popup>{t("your_location")}</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default PropertiesMap;