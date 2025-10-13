import React, { useState, useEffect, useRef } from "react";
import "./Interactive.css";
import "react-tooltip/dist/react-tooltip.css";
import Ripples from "react-ripples";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";

const Interactive = () => {
  const { t, i18n } = useTranslation("global");
  const [subCategories, setSubCategories] = useState([]);
  const [theme, setTheme] = useState(
    () => sessionStorage.getItem("theme") || "light"
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    sessionStorage.setItem("theme", theme);
  }, [theme]);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Create refs for each dropdown
  const dropdownRefs = {
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
    4: useRef(null),
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const currentRef = dropdownRefs[openDropdown];
      if (
        currentRef &&
        currentRef.current &&
        !currentRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [openDropdown]);

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await axios.get(
          `https://3ayin.resporthub.com/api/categories/sub-categories`,
          {
            headers: {
              Lang: i18n.language,
            },
          }
        );
        const categories = res?.data?.data || [];
        const serviceCategory = categories.find((cat) => cat.id === 1);

        if (serviceCategory) {
          setSubCategories(serviceCategory.sub_categories);
        }
      } catch (error) {
      }
    };

    fetchSubCategories();
  }, [i18n.language]);
  return (
    <div className="interactive py-5 mt-4">
      <div className="container">
        <div className="text-center interactive_btns">
          <img className="main_img" src="/mask.png" alt="--" />
          <img
            className="after_img"
            src={`${
              theme === "dark" ? "/interactive-dark.png" : "/interactive.png"
            }`}
            alt="--"
          />

          {/* Button 1 */}
          <div className="btn1" ref={dropdownRefs[1]}>
            <div className="spinner spin-div"></div>
            <Ripples color="rgba(219, 146, 12, 0.63)" during={1500}>
              <button
                data-tooltip-id="tooltip1"
                data-tooltip-content={t("services.clickHere")}
                onClick={() => toggleDropdown(1)}
              >
                <img src="/icon1.png" alt="Icon 1" />
              </button>
            </Ripples>
            <Tooltip id="tooltip1" />
            {openDropdown === 1 && (
              <div className="dropdown" data-aos="fade-up">
                <ul>
                  {/* <ul>
                    {subCategories.length > 0 ? (
                      subCategories.map((sub) => (
                        <li key={sub.id}>
                          <Link className="d-block" to={`/all_services/${sub.id}`}>{sub.name}</Link>
                        </li>
                      ))
                    ) : (
                      <li>--</li>
                    )}
                  </ul> */}
                  <li>
                    <Link className="d-block" to="/publish_ad">{t("create_ad.publishAd")}</Link>
                  </li>
                  <li>
                    <Link className="d-block" to="/all_ads">{t("labels.all_ads")}</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Button 2 */}
          <div className="btn2" ref={dropdownRefs[2]}>
            <div className="spinner spin-div"></div>
            <Ripples color="rgba(219, 146, 12, 0.63)" during={1500}>
              <button
                data-tooltip-id="tooltip2"
                data-tooltip-content={t("services.clickHere")}
                onClick={() => toggleDropdown(2)}
              >
                <img src="/icon2.png" alt="Icon 2" />
              </button>
            </Ripples>
            <Tooltip id="tooltip2" />
            {openDropdown === 2 && (
              <div className="dropdown" data-aos="fade-up">
                <ul>
                  <li>
                    <Link className="d-block" to="/properties_AR_VR">{t("services.3ayinVrAr")}</Link>
                  </li>
                  <li>
                    <Link className="d-block" to="/properties_map">{t("services.3ayinMap")}</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Button 3 */}
          <div className="btn3" ref={dropdownRefs[3]}>
            <div className="spinner spin-div"></div>
            <Ripples color="rgba(219, 146, 12, 0.63)" during={1500}>
              <button
                data-tooltip-id="tooltip3"
                data-tooltip-content={t("services.clickHere")}
                onClick={() => toggleDropdown(3)}
              >
                <img src="/icon3.png" alt="Icon 3" />
              </button>
            </Ripples>
            <Tooltip id="tooltip3" />
            {openDropdown === 3 && (
              <div className="dropdown" data-aos="fade-up">
                <ul>                  
                  <li>
                    <Link className="d-block" to="/add_property">{t("navbar.add_property")}</Link>
                  </li>
                  <li>
                    <Link className="d-block" to="/all_properties">{t("property.all")}</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Button 4 */}
          <div className="btn4" ref={dropdownRefs[4]}>
            <div className="spinner spin-div"></div>
            <Ripples color="rgba(219, 146, 12, 0.63)" during={1500}>
              <button
                data-tooltip-id="tooltip4"
                data-tooltip-content={t("services.clickHere")}
                onClick={() => toggleDropdown(4)}
              >
                <img src="/icon4.png" alt="Icon 4" />
              </button>
            </Ripples>
            <Tooltip id="tooltip4" />
            {openDropdown === 4 && (
              <div className="dropdown" data-aos="fade-up">
                <ul>
                  <li>
                    <Link className="d-block" to="/packages">{t("packages.title")}</Link>
                  </li>
                  <li>
                    <Link to="/faq" className="d-block">{t("footer.faq")}</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interactive;
