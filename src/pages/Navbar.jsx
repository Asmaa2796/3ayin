import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FiUser, FiSearch } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";
import { useRef } from "react";
import { logout } from "../redux/Slices/authSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const { t, i18n } = useTranslation("global");
  const [isMobileScrolled, setIsMobileScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() =>
    JSON.parse(sessionStorage.getItem("user3ayin"))
  );
  useEffect(() => {
    const readUser = () => {
      try {
        return JSON.parse(sessionStorage.getItem("user3ayin"));
      } catch {
        return null;
      }
    };

    const handleStorage = (e) => {
      // storage event fires for other tabs
      setUser(readUser());
    };

    const handleUserUpdated = (e) => {
      // custom event from same tab (e.detail contains updatedUser)
      setUser(e?.detail ?? readUser());
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("userUpdated", handleUserUpdated);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("userUpdated", handleUserUpdated);
    };
  }, []);

  const [theme, setTheme] = useState(
    () => sessionStorage.getItem("theme") || "light"
  );

  const dispatch = useDispatch();
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const megaMenuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setIsMegaOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 768;
      const scrolled = window.scrollY >= 100;
      setIsMobileScrolled(isMobile && scrolled);
    };

    handleScroll(); // initial check

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user3ayin"));

    if (!user && location.pathname === "/publish_ad" || !user && location.pathname === "/add_property" || !user && location.pathname === "/profile" || !user && location.pathname.startsWith("/service_provider")) {
      toast.warning(t("please_log_in_to_continue"));
      navigate("/login");
    }
  }, [location]);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    sessionStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    dispatch(logout());
    setUser(null);
    toast.success(t("topnav.logoutSuccess"), {
      onClose: () => window.location.reload(),
    });
  };
  return (
    <div
      className={`navbar navbar-expand-lg ${
        isMobileScrolled ? "fixed-top" : ""
      }`}
    >
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/">
          <img
            src={`${theme === "dark" ? "/logo-dark.png" : "/logo-white.png"}`}
            onError={(e) => {
              e.target.src = "/logo-white.png";
            }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ borderColor: theme === "dark" ? "#777" : "#ddd" }}
        >
          <span>
            <i
              className="bi bi-list"
              style={{
                color: theme === "dark" ? "var(--basic-color)" : "#000",
              }}
            ></i>
          </span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav align-items-center list-unstyled mx-auto mb-0 d-flex gap-3 p-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                {t("navbar.home")}
              </Link>
            </li>
            <li className="nav-item position-relative" ref={megaMenuRef}>
              <button
                className="nav-link d-flex align-items-center gap-1 bg-transparent border-0"
                onClick={() => setIsMegaOpen(!isMegaOpen)}
              >
                {t("navbar.3ayinServices")}
                <FiChevronDown />
              </button>

              {isMegaOpen && (
                <div className="mega-menu">
                  <div className="row">
                    <div className="col-xl-2 col-lg-2">
                      <div className="ul ul1">
                        <h6>{t("interactive.realEstateMarketing")}</h6>
                        <ul className="list-unstyled">
                          <li>
                            <Link to="">{t("services.3ayinMarketing")}</Link>
                          </li>
                          <li>
                            <Link to="">{t("services.selfMarketing")}</Link>
                          </li>
                          <li>
                            <Link to="">{t("services.agencyMarketing")}</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-xl-2 col-lg-2">
                      <div className="ul">
                        <h6>{t("interactive.realEstateServices")}</h6>
                        <ul className="list-unstyled">
                          <li>
                            <Link to="">{t("services.erp")}</Link>
                          </li>
                          <li>
                            <Link to="">{t("services.crm")}</Link>
                          </li>
                          <li>
                            <Link to="">{t("services.3ayinMarketing")}</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-3">
                      <div className="ul ul1">
                        <h6>{t("interactive.engineeringServices")}</h6>
                        <ul className="list-unstyled">
                          <li>
                            <Link to="">{t("services.designConsulting")}</Link>
                          </li>
                          <li>
                            <Link to="">{t("services.construction")}</Link>
                          </li>
                          <li>
                            <Link to="">{t("services.maintenance")}</Link>
                          </li>
                          <li>
                            <Link to="">{t("services.vrAr")}</Link>
                          </li>
                          <li>
                            <Link to="">{t("services.3ayinEngineering")}</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-xl-2 col-lg-2">
                      <div className="ul">
                        <h6>{t("interactive.educationalServices")}</h6>
                        <ul className="list-unstyled">
                          <li>
                            <Link to="">{t("services.realEstateCourses")}</Link>
                          </li>
                          <li>
                            <Link to="">
                              {t("services.engineeringCourses")}
                            </Link>
                          </li>
                          <li>
                            <Link to="">{t("services.vrCourses")}</Link>
                          </li>
                          <li>
                            <Link to="">{t("services.educationCenter")}</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-3">
                      <div className="ul ul1">
                        <h6>{t("interactive.additionalServices")}</h6>
                        <ul className="list-unstyled">
                          <li>
                            <Link to="">{t("services.pdfMaps")}</Link>
                          </li>
                          <li>
                            <Link to="">{t("services.vrLocations")}</Link>
                          </li>
                          <li>
                            <Link to="">{t("services.legalConsulting")}</Link>
                          </li>
                          <li>
                            <Link to="">{t("services.financing")}</Link>
                          </li>
                          <li>
                            <Link to="">{t("services.analysisReports")}</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center gap-1"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {t("navbar.3ayinProperty")}
                <FiChevronDown />
              </a>
              <div
                className="dropdown-menu"
                style={{
                  backgroundColor: `${
                    theme === "dark" ? "var(--dark-color)" : "#EBEBEB"
                  }`,
                }}
                aria-labelledby="navbarDropdown"
              >
                <h6
                  className="mx-3"
                  style={{
                    textAlign: `${i18n.language === "ar" ? "right" : "left"}`,
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  {t("navbar.3ayinProperty")}
                </h6>
                <Link
                  className="dropdown-item"
                  to="/about"
                  style={{ fontSize: "13px" }}
                >
                  {t("services.about3ayinProperty")}
                </Link>
                <Link className="dropdown-item" style={{ fontSize: "13px" }}>
                  {t("services.3ayinMap")}
                </Link>
                <Link className="dropdown-item" style={{ fontSize: "13px" }}>
                  {t("services.3ayinVrAr")}
                </Link>
              </div>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center gap-1"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {t("navbar.3ayinAffiliate")}
                <FiChevronDown />
              </a>
              <div
                className="dropdown-menu"
                style={{
                  backgroundColor: `${
                    theme === "dark" ? "var(--dark-color)" : "#EBEBEB"
                  }`,
                }}
                aria-labelledby="navbarDropdown"
              >
                <h6
                  className="mx-3"
                  style={{
                    textAlign: `${i18n.language === "ar" ? "right" : "left"}`,
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  {t("navbar.3ayinAffiliate")}
                </h6>
                <Link className="dropdown-item" style={{ fontSize: "13px" }}>
                  {t("services.individualMarketers")}
                </Link>
                <Link className="dropdown-item" style={{ fontSize: "13px" }}>
                  {t("services.individualEngineers")}
                </Link>
              </div>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center gap-1"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {t("navbar.3ayinCompanies")}
                <FiChevronDown />
              </a>
              <div
                className="dropdown-menu"
                style={{
                  backgroundColor: `${
                    theme === "dark" ? "var(--dark-color)" : "#EBEBEB"
                  }`,
                }}
                aria-labelledby="navbarDropdown"
              >
                <h6
                  className="mx-3"
                  style={{
                    textAlign: `${i18n.language === "ar" ? "right" : "left"}`,
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  {t("navbar.3ayinCompanies")}
                </h6>
                <Link className="dropdown-item" style={{ fontSize: "13px" }}>
                  {t("services.realEstateCompanies")}
                </Link>
                <Link className="dropdown-item" style={{ fontSize: "13px" }}>
                  {t("services.engineeringCompanies")}
                </Link>
                <Link className="dropdown-item" style={{ fontSize: "13px" }}>
                  {t("services.educationalCompanies")}
                </Link>
              </div>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="all_properties">
                {t("navbar.real_estate_services")}
              </Link>
            </li>
          </ul>
        </div>

        <ul className="actions list-unstyled p-0 d-flex align-items-center gap-3 m-0">
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle add btn p-0 border-0 bg-transparent d-flex align-items-center"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-chevron-down text-xs fw-bold mt-1 mx-1"></i>{" "}
              {t("navbar.add")}
            </button>

            <ul
              className="dropdown-menu dropdown-menu-end overflow-hidden"
              style={{
                backgroundColor: `${
                  theme === "dark" ? "var(--dark-color)" : "var(--basic-color)"
                }`,
              }}
            >
              <li className="dropdown-item text-sm">
                <button
                  className="d-block bg-transparent border-0"
                  style={{ color: theme === "dark" ? "#fff" : "#222" }}
                  onClick={() => {
                    if (user) {
                      navigate("/publish_ad");
                    } else {
                      toast.warning(t("please_log_in_to_continue"));
                    }
                  }}
                >
                  {t("navbar.add_service")}
                </button>
              </li>
              <li className="dropdown-item text-sm">
                <button
                  className="d-block bg-transparent border-0"
                  style={{ color: theme === "dark" ? "#fff" : "#222" }}
                  onClick={() => {
                    if (user) {
                      navigate("/add_property");
                    } else {
                      toast.warning(t("please_log_in_to_continue"));
                    }
                  }}
                >
                  {t("navbar.add_property")}
                </button>
              </li>
            </ul>
          </li>
          <li>
            <FiSearch />
          </li>
          {user ? (
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle bg-transparent border-0 d-flex align-items-center gap-1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="Language"
              >
                {user?.user.type === "company"
                  ? user?.user.profile?.username
                  : user?.user.profile?.name}
                <FiChevronDown />
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end overflow-hidden"
                style={{
                  backgroundColor: `${
                    theme === "dark"
                      ? "var(--dark-color)"
                      : "var(--basic-color)"
                  }`,
                }}
              >
                <li className="dropdown-item text-sm">
                  <Link
                    style={{ color: theme === "dark" ? "#fff" : "#222" }}
                    to="/profile"
                    className="d-block"
                  >
                    {t("topnav.profile")}
                  </Link>
                </li>
                <li className="dropdown-item text-sm">
                  <Link
                    className="d-block"
                    style={{ color: theme === "dark" ? "#fff" : "#222" }}
                    to={`/service_provider/${user?.user?.id}`}
                  >
                    {t("profile.serviceProvider")}
                  </Link>
                </li>
                <li
                  className="dropdown-item text-sm d-block"
                  onClick={handleLogout}
                >
                  {t("topnav.logout")}
                </li>
              </ul>
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                style={{
                  color: `${theme === "dark" ? "var(--basic-color)" : "#000"}`,
                }}
              >
                <FiUser />
              </Link>
            </li>
          )}

          {/* Language Switcher */}
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle bg-transparent border-0 d-flex align-items-center gap-1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="Language"
            >
              {i18n.language === "ar" ? "العربية" : "English"}
              <FiChevronDown />
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              style={{
                backgroundColor: `${
                  theme === "dark" ? "var(--dark-color)" : "var(--basic-color)"
                }`,
              }}
            >
              <li>
                <button
                  onClick={() => changeLanguage("en")}
                  className="dropdown-item text-sm"
                >
                  {i18n.language === "en" ? "English" : "الإنجليزية"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => changeLanguage("ar")}
                  className="dropdown-item text-sm"
                >
                  {i18n.language === "ar" ? "العربية" : "Arabic"}
                </button>
              </li>
            </ul>
          </li>

          {/* Custom Theme Switch */}
          {/* <li>
            <div className="switch">
              <input
                type="checkbox"
                className="switch__input"
                id="Switch"
                onChange={toggleTheme}
                checked={theme === "dark"}
              />
              <label className="switch__label" htmlFor="Switch">
                <span className="switch__indicator"></span>
                <span className="switch__decoration"></span>
              </label>
            </div>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
