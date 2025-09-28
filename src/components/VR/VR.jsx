import React from "react";
import "./VR.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { fetchSettings } from "../../redux/Slices/SettingsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const VR = () => {
  const { t, i18n } = useTranslation("global");
  const { settings } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);
  return (
    <div className="vr_section py-5">
      <div className="container">
        <div className="text">
          <h3 className="llne-height text-white">{t("vr.title")}</h3>
          <p className="line-height text-white">{t("vr.description")}</p>
          <Link
            to={settings?.promotion_video_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("vr.se")}
            <i
              className={`mx-1 bi ${
                i18n.language === "ar" ? "bi-arrow-left" : "bi-arrow-right"
              }`}
            ></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VR;