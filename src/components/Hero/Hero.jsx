import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "./Hero.css";

const Hero = () => {
  const { t, i18n } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = (type) => {
    if (searchValue.trim() === "") {
      toast.error(t("home.enterSearch"));
      return;
    }

    if (type === "ads") {
      navigate(`/all_ads?search=${encodeURIComponent(searchValue.trim())}`);
    } else if (type === "properties") {
      navigate(`/all_properties?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <div className={`hero py-5 text-center ${i18n.language === "ar" ? "rtl" : ""}`}>
      <div className="container">
        <h1>
          <Trans
            i18nKey="home.tagline"
            components={{
              realestate: <span className="custom-span gray-color" />,
            }}
          />
        </h1>

        <p className="line-height gray-color my-4">
          {t("home.platform")}
        </p>

        <div className="hero-search-form d-flex">
          <FiSearch />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t("home.searchHere")}
            aria-label="Search Input"
          />

          {/* Dropdown button as search */}
          <div className="dropdown ms-2">
            <button
              className="btn btn-success dropdown-toggle text-sm"
              type="button"
              id="searchDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {t("home.searchIn")}
            </button>
            <ul className="dropdown-menu" aria-labelledby="searchDropdown">
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => handleSearch("ads")}
                >
                  {t("home.ads")}
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => handleSearch("properties")}
                >
                  {t("home.properties")}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </div>
  );
};

export default Hero;
