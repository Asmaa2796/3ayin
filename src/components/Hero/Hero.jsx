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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchValue.trim() === "") {
      toast.error(t("home.enterSearch"));
      return;
    }

    navigate(`/all_ads?search=${encodeURIComponent(searchValue.trim())}`);
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

        <form onSubmit={handleSubmit} className="hero-search-form">
          <FiSearch />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t("home.searchHere")}
            aria-label="Search Input"
          />
          <button type="submit">{t("home.search")}</button>
        </form>

        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </div>
  );
};

export default Hero;
