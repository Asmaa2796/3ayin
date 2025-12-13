import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import "../Properties/property.css";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { Link } from "react-router-dom";

// Custom icon for ads
const createAdIcon = (ad, i18n) => {
  const color = "#24782dff"; // main marker color

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position: relative; width: 30px; height: 40px;">
        <!-- Main pin SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/>
          <circle cx="12" cy="10" r="3" fill="white"/>
        </svg>

        <!-- VR/AR image if exists -->
        ${
          ad?.AR_VR
            ? `<a href="${ad.AR_VR}" target="_blank" style="position:absolute; top:-5px; ${i18n.language==='ar'?'left:-5px;':'right:-5px;'} display:block;">
                 <img src="/vr-glasses.png" style="width:20px; height:auto;" alt="VR/AR" />
               </a>`
            : ""
        }
      </div>
    `,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });
};


// Validate coordinates
const hasValidCoords = (ad) =>
    ad?.location_lat &&
    ad?.location_long &&
    !isNaN(Number(ad.location_lat)) &&
    !isNaN(Number(ad.location_long));

const ServicesMap = () => {
    const { t, i18n } = useTranslation("global");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ads, setAds] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef(null);

    // Fit bounds to all ads
    const fitMapToMarkers = (list) => {
        if (mapRef.current && list.length > 0) {
            const coords = list.map((a) => [Number(a.location_lat), Number(a.location_long)]);
            const bounds = L.latLngBounds(coords);
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        } else if (mapRef.current) {
            mapRef.current.setView([30.0444, 31.2357], 8);
        }
    };

    // Fetch nearby ads from API
    const fetchNearbyAds = async (lat, lng) => {
        setLoading(true);
        setError(null);
        try {
            const base = process.env.REACT_APP_BASE_URL || "";
            const url = `${base}/api/ads/near?lat=${lat}&lng=${lng}`;
            const res = await axios.get(url, { headers: { Lang: i18n.language } });
            const list = res.data?.data || [];
            const validAds = list.filter(hasValidCoords);
            setAds(validAds);
            fitMapToMarkers(validAds);
        } catch (err) {
            console.error(err);
            setError(t("failed_to_load_services"));
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
                    fetchNearbyAds(latitude, longitude);
                },
                () => {
                    setUserLocation({ lat: 30.0444, lng: 31.2357 }); // Cairo fallback
                    fetchNearbyAds(30.0444, 31.2357);
                }
            );
        } else {
            setUserLocation({ lat: 30.0444, lng: 31.2357 });
            fetchNearbyAds(30.0444, 31.2357);
        }
    };

    useEffect(() => {
        detectUserLocation();
    }, [i18n.language]);

    const userIcon = L.divIcon({
        html: `<div style="width:16px;height:16px;background:#007bff;border-radius:50%;border:2px solid white;"></div>`,
        iconSize: [16, 16],
        className: "user-location-marker",
    });

    return (
        <>
            <Breadcrumb title={t("services_map")} />
            <div className="services-map-wrapper">
                <div className="map-footer my-2">
                    {loading && <div className="map-status">{t("loading")}</div>}
                    {error && <div className="map-error">{t("failed_to_load_services")}</div>}
                </div>

                <div className="map-container">
                    <MapContainer
                        center={[30.0444, 31.2357]}
                        zoom={10}
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

                        {/* User marker */}
                        {userLocation && (
                            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                                <Popup>{t("your_location")}</Popup>
                            </Marker>
                        )}

                        {/* Ads markers */}
                        {ads.map((ad) => (
                            <Marker
                                key={ad.id}
                                position={[Number(ad.location_lat), Number(ad.location_long)]}
                                icon={createAdIcon(ad, i18n)} // pass i18n to handle AR/VR positioning
                            >
                                <Popup>
                                    <div style={{ minWidth: 160 }}>
                                        {ad?.AR_VR && (
                                            <>
                                                <Link
                                                    className="d-block text-center position-absolute"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    to={ad?.AR_VR}
                                                    style={{ left: i18n.language === "ar" ? "20px" : "unset", right: i18n.language === "ar" ? "unset" : "20px", top: "10px" }}
                                                >
                                                    <img src="/vr-glasses.png" style={{ width: "auto", maxHeight: "20px" }} alt="--" />
                                                    <small className="fw-bold main-color d-block mb-2 text-center" style={{ fontSize: "8px" }}>
                                                        VR/AR
                                                    </small>
                                                </Link>
                                            </>
                                        )}
                                        <strong>{t("create_ad.title")}: {ad?.ad_name}</strong>
                                        <br />
                                        <small>{t("create_ad.description")}: {ad?.small_desc ? ad?.small_desc : t("labels.undefined")}</small>
                                        <br />
                                        {t("create_ad.location")}: {ad?.location || "—"}
                                        <br />
                                        {t("create_ad.price")} : {ad?.price ? `${ad?.price} ${t("recommendedServices.currency")}` : t("labels.currency")}
                                        <br />
                                        <div style={{ marginTop: "5px" }}>
                                            <Link to={`/serviceDetails/${ad.id}`}>
                                                {t("create_ad.service_details")}{" "}
                                                <i
                                                    style={{ fontSize: "10px" }}
                                                    className={`bi ${i18n.language === "ar"
                                                            ? "bi-chevron-left"
                                                            : "bi-chevron-right"
                                                        }`}
                                                ></i>
                                            </Link>
                                        </div>
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

export default ServicesMap;
