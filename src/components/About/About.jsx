import React, { useEffect } from "react";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import ContentLoader from "../../pages/ContentLoader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAbout } from "../../redux/Slices/AboutSlice";
import { Link } from "react-router-dom";
const HowItWorks = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const { aboutus, isLoading } = useSelector((state) => state.aboutus);
  useEffect(() => {
    dispatch(fetchAbout());
  }, [dispatch, i18n.language, t]);
  return (
    <div className="bg_overlay">
      <Breadcrumb title={t("pages.about")} />
      <div className="py-5 about position-relative">
        <div className="container">
          {isLoading ? (
            <ContentLoader />
          ) : aboutus ? (
            <>
              <div className="logo">
                <Link to="/">
                  <img
                    src="/logo-white.png"
                    className="mx-auto d-block"
                    alt="--"
                  />
                </Link>
              </div>
              <div className="plan-details my-3">
                {aboutus?.desc?.split("\n").map((line, idx) => (
                  <p key={idx} className="mb-2">
                    {line}
                  </p>
                ))}
              </div>
            </>
          ) : (
            <div className="no_data bg-white py-5 border rounded-2 my-3 text-center">
              <h5 className="mb-0 text-sm">{t("no_data_exists")}</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
