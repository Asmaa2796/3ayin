import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FiUser, FiSearch } from "react-icons/fi";
import { FiHome, FiChevronDown } from "react-icons/fi";
import { FaUserCog } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRef } from "react";
import { logout } from "../redux/Slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategoriesTree } from "../redux/Slices/FilterServicesSlice";
import axios from "axios";
const Navbar = () => {
  const { t, i18n } = useTranslation("global");
  const [isMobileScrolled, setIsMobileScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { filterByCats } = useSelector((state) => state.filterServices);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false); // desktop mega
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false); // mobile side menu
  const [profileCompanyName, setProfileCompanyName] = useState(false);
  const [profileName, setProfileName] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const userData = JSON.parse(sessionStorage.getItem("user3ayin"));
  const token = userData?.token;
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
  const megaMenuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setIsMegaMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const getProfileData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/profileData`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          Lang: i18n.language,
        },
      });

      const user = response.data.data?.user;
      if (!user) return;

      setProfileCompanyName(user?.profile?.username);
      setProfileName(user?.profile?.name);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY >= 100;
      const isMobile = window.innerWidth <= 992;

      setIsMobileScrolled(isMobile && scrolled);
      setIsScrolled(!isMobile && scrolled);
    };

    handleScroll(); // initial check
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const isLoggedIn = !!user;

  useEffect(() => {
    if (
      !isLoggedIn &&
      ["/publish_ad", "/add_property", "/user_profile"].includes(
        location.pathname
      )
    ) {
      toast.warning(t("please_log_in_to_continue"));
      navigate("/login");
    }

    if (!isLoggedIn && location.pathname.startsWith("/provider_profile")) {
      toast.warning(t("please_log_in_to_continue"));
      navigate("/login");
    }
  }, [isLoggedIn, location, navigate]);

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
  const handleSearch = (type) => {
    if (searchValue.trim() === "") {
      toast.error(t("home.enterSearch"));
      return;
    }

    if (type === "ads") {
      navigate(`/all_ads?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
    } else if (type === "properties") {
      navigate(
        `/all_properties?search=${encodeURIComponent(searchValue.trim())}`
      );
      setSearchValue("");
    }
    setIsSearchOpen(false); // close modal after search
  };
  useEffect(() => {
    dispatch(fetchAllCategoriesTree());
  }, [dispatch, i18n.language]);
  // inside Navbar.jsx, above return
  const NavLinks = ({ isMobile = false, onCloseMenu }) => {
    // Only use mobile toggles when rendering mobile menu
    const [openSections, setOpenSections] = useState({
      services: false,
      property: false,
      affiliate: false,
      companies: false,
    });

    const toggleSection = (key) =>
      setOpenSections((s) => ({ ...s, [key]: !s[key] }));

    const renderSubCatsMobile = (catId) =>
      filterByCats?.data
        ?.filter((cat) => cat.id === catId)
        ?.flatMap((mainCat) =>
          mainCat.sub_categories?.map((sub) => (
            <li key={sub.id}>
              <Link
                to={`/all_ads?sub_category_id=${sub.id}`}
                onClick={onCloseMenu}
                className="d-block py-1 main-color"
              >
                {sub.name}
              </Link>
              {sub.sub_sub_categories?.length > 0 && (
                <ul className="ps-3">
                  {sub.sub_sub_categories.map((ss) => (
                    <li key={ss.id}>
                      <Link
                        to={`/all_ads?sub_sub_category_id=${ss.id}`}
                        onClick={onCloseMenu}
                        className="d-block py-1 text-dark"
                      >
                        {ss.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))
        );

    if (isMobile) {
      return (
        <div className="px-3">
          <ul className="list-unstyled mb-0">
            <li>
              <Link
                onClick={onCloseMenu}
                to="/"
                className="d-flex align-items-center gap-2 py-2 text-dark text-decoration-none"
              >
                <FiHome className="main-color" />
                <span>{t("navbar.home")}</span>
              </Link>
            </li>

            <li>
              <button
                className="btn w-100 text-start py-2 d-flex justify-content-between align-items-center"
                onClick={() => toggleSection("services")}
              >
                <span>{t("navbar.3ayinServices")}</span>
                <FiChevronDown
                  className={`transition-transform ${
                    openSections.services ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.services && (
                <ul className="list-unstyled ps-3">{renderSubCatsMobile(1)}</ul>
              )}
            </li>

            <li>
              <button
                className="btn w-100 text-start py-2 d-flex justify-content-between align-items-center"
                onClick={() => toggleSection("property")}
              >
                <span>{t("navbar.3ayinProperty")}</span>
                <FiChevronDown
                  className={`transition-transform ${
                    openSections.property ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.property && (
                <ul className="list-unstyled ps-3">
                  <li>
                    <Link
                      to="/all_properties"
                      onClick={onCloseMenu}
                      className="d-block py-1 text-dark"
                    >
                      {t("services.about3ayinProperty")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/properties_map"
                      onClick={onCloseMenu}
                      className="d-block py-1 text-dark"
                    >
                      {t("services.3ayinMap")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/properties_AR_VR"
                      onClick={onCloseMenu}
                      className="d-block py-1 text-dark"
                    >
                      {t("services.3ayinVrAr")}
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <button
                className="btn w-100 text-start py-2 d-flex justify-content-between align-items-center"
                onClick={() => toggleSection("affiliate")}
              >
                <span>{t("navbar.3ayinAffiliate")}</span>
                <FiChevronDown
                  className={`transition-transform ${
                    openSections.affiliate ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.affiliate && (
                <ul className="list-unstyled ps-3">
                  {filterByCats?.data
                    ?.filter((cat) => cat.id === 2)
                    ?.flatMap((mainCat) =>
                      mainCat.sub_categories?.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            onClick={onCloseMenu}
                            to={`/all_ads?sub_category_id=${sub.id}`}
                            className="d-block py-1 text-dark"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))
                    )}
                </ul>
              )}
            </li>

            <li>
              <button
                className="btn w-100 text-start py-2 d-flex justify-content-between align-items-center"
                onClick={() => toggleSection("companies")}
              >
                <span>{t("navbar.3ayinCompanies")}</span>
                <FiChevronDown
                  className={`transition-transform ${
                    openSections.companies ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.companies && (
                <ul className="list-unstyled ps-3">
                  {filterByCats?.data
                    ?.filter((cat) => cat.id === 3)
                    ?.flatMap((mainCat) =>
                      mainCat.sub_categories?.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            onClick={onCloseMenu}
                            to={`/all_ads?sub_category_id=${sub.id}`}
                            className="d-block py-1 text-dark"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))
                    )}
                </ul>
              )}
            </li>
          </ul>
        </div>
      );
    }

    return (
      <ul className="navbar-nav align-items-center list-unstyled mx-auto mb-0 d-flex gap-3 p-0">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            {t("navbar.home")}
          </Link>
        </li>

        <li className="nav-item position-relative" ref={megaMenuRef}>
          <button
            className="nav-link d-flex align-items-center gap-1 bg-transparent border-0"
            onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
          >
            {t("navbar.3ayinServices")}
            <FiChevronDown />
          </button>

          {isMegaMenuOpen && (
            <div className="mega-menu shadow" ref={megaMenuRef}>
              <div className="row">
                {filterByCats?.data
                  ?.filter((cat) => cat.id === 1)
                  ?.flatMap((mainCat) =>
                    mainCat.sub_categories?.map((sub, index) => (
                      <div
                        key={sub.id}
                        className={`col-xl-${
                          [3, 5].includes(index + 1) ? "3" : "2"
                        } 
                          col-lg-${[3, 5].includes(index + 1) ? "3" : "2"} 
                          col-md-4 col-sm-6`}
                      >
                        <div className={`ul ${index % 2 === 0 ? "ul1" : ""}`}>
                          <h6 className="fw-bold">{sub.name}</h6>
                          <ul className="list-unstyled">
                            {sub.sub_sub_categories?.length > 0 ? (
                              sub.sub_sub_categories.map((subSub) => (
                                <li key={subSub.id}>
                                  <Link
                                    to={`/all_ads?sub_sub_category_id=${subSub.id}`}
                                    onClick={() => setIsMegaMenuOpen(false)}
                                    className="text-decoration-none text-dark"
                                  >
                                    {subSub.name}
                                  </Link>
                                </li>
                              ))
                            ) : (
                              <li className="text-muted small">
                                {t("navbar.no_subcategories")}
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    ))
                  )}
              </div>
            </div>
          )}
        </li>

        {/* 3ayin Property dropdown (desktop) */}
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
                textAlign: i18n.language === "ar" ? "right" : "left",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {t("navbar.3ayinProperty")}
            </h6>
            <Link
              className="dropdown-item"
              to="/all_properties"
              style={{ fontSize: "13px" }}
            >
              {t("services.about3ayinProperty")}
            </Link>
            <Link
              className="dropdown-item"
              to="/properties_map"
              style={{ fontSize: "13px" }}
            >
              {t("services.3ayinMap")}
            </Link>
            <Link
              className="dropdown-item"
              to="/properties_AR_VR"
              style={{ fontSize: "13px" }}
            >
              {t("services.3ayinVrAr")}
            </Link>
          </div>
        </li>

        {/* Affiliate (desktop) */}
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle d-flex align-items-center gap-1"
            id="affiliateDropdown"
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
              backgroundColor:
                theme === "dark" ? "var(--dark-color)" : "#EBEBEB",
            }}
            aria-labelledby="affiliateDropdown"
          >
            <h6
              className="mx-3"
              style={{
                textAlign: i18n.language === "ar" ? "right" : "left",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {t("navbar.3ayinAffiliate")}
            </h6>

            {filterByCats?.data
              ?.filter((cat) => cat.id === 2)
              ?.flatMap((mainCat) =>
                mainCat.sub_categories?.map((sub) => (
                  <Link
                    key={sub.id}
                    className="dropdown-item"
                    to={`/all_ads?sub_category_id=${sub.id}`}
                    onClick={() => setIsSideMenuOpen(false)}
                    style={{ fontSize: "13px" }}
                  >
                    {sub.name}
                  </Link>
                ))
              )}
          </div>
        </li>

        {/* Companies (desktop) */}
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle d-flex align-items-center gap-1"
            id="companiesDropdown"
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
              backgroundColor:
                theme === "dark" ? "var(--dark-color)" : "#EBEBEB",
            }}
            aria-labelledby="companiesDropdown"
          >
            <h6
              className="mx-3"
              style={{
                textAlign: i18n.language === "ar" ? "right" : "left",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {t("navbar.3ayinCompanies")}
            </h6>

            {filterByCats?.data
              ?.filter((cat) => cat.id === 3)
              ?.flatMap((mainCat) =>
                mainCat.sub_categories?.map((sub) => (
                  <Link
                    key={sub.id}
                    className="dropdown-item"
                    to={`/all_ads?sub_category_id=${sub.id}`}
                    onClick={() => setIsSideMenuOpen(false)}
                    style={{ fontSize: "13px" }}
                  >
                    {sub.name}
                  </Link>
                ))
              )}
          </div>
        </li>
      </ul>
    );
  };

  return (
    <>
      <div
        className={`${
          isMobileScrolled ? "shadow-sm" : ""
        } mobile_topbar d-flex justify-content-between align-items-center px-3 py-2 d-lg-none`}
      >
        <div className="d-flex align-items-center gap-2">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              src={theme === "dark" ? "/logo-dark.png" : "/logo-white.png"}
              alt="logo"
              onError={(e) => (e.target.src = "/logo-white.png")}
            />
          </Link>
          <button
            className="btn bg-transparent border-0 p-0"
            onClick={() => setIsSideMenuOpen(true)}
            aria-label="Open side menu"
          >
            <RxHamburgerMenu size={13} />
          </button>
        </div>

        <div className="d-flex align-items-center gap-3">
       
          <div className="dropdown">
            <button
              className="nav-link dropdown-toggle add btn p-0 border-0 bg-transparent d-flex align-items-center"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ fontSize: "small" }}
            >
              {t("navbar.add")}
              <i className="bi bi-chevron-down text-xs fw-bold mt-1 mx-1"></i>{" "}
            </button>

            <ul
              className={`dropdown-menu dropdown-menu-${i18n.language === "en"?"end":""} overflow-hidden`}
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
          </div>
          <button
            className="btn bg-transparent border-0 p-0"
            onClick={() => setIsSearchOpen(true)}
          >
            <FiSearch size={13} />
          </button>

          <button
            className="btn bg-transparent border-0 p-0 text-sm fw-bold"
            onClick={() => changeLanguage(i18n.language === "ar" ? "en" : "ar")}
          >
            {i18n.language === "ar" ? "EN" : "ع"}
          </button>

          {/* 👤 User */}
          {user ? (
            <div className="dropdown">
              <button
                className="btn bg-transparent border-0 p-0 d-flex align-items-center"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaUserCog size={13} />
              </button>
              <ul
                className="dropdown-menu position-absolute mt-2"
                style={{
                  backgroundColor:
                    theme === "dark"
                      ? "var(--dark-color)"
                      : "var(--basic-color)",
                }}
              >
                <li>
                  <Link
                    to="/user_profile"
                    className="dropdown-item text-sm"
                    onClick={() => setIsMegaMenuOpen(false)}
                  >
                    {t("topnav.profile")}
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/provider_profile/${user?.user?.id}`}
                    className="dropdown-item text-sm"
                    onClick={() => setIsMegaMenuOpen(false)}
                  >
                    {t("profile.serviceProvider")}
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item text-sm"
                    onClick={() => {
                      handleLogout();
                      setIsMegaMenuOpen(false);
                    }}
                  >
                    {t("topnav.logout")}
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="text-dark">
              <FiUser size={15} />
            </Link>
          )}
        </div>
      </div>

      <div
        className={`navbar navbar-expand-lg d-none d-lg-flex
        ${isScrolled ? "fixed-top shadow-sm" : ""}
        `}
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
            <NavLinks />
          </div>
          {/* maps */}
          <div className="map_icons">
            <Link to="/properties_map"><img src="propMap.png" className="d-block" alt="--"/><div>{t("properties_map")}</div></Link>
            <Link to="/services_map"><img src="adsMap.png" className="d-block" alt="--"/><div>{t("services_map")}</div></Link>
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
                className={`dropdown-menu dropdown-menu-${i18n.language === "en"?"end":""} overflow-hidden`}
                style={{
                  backgroundColor: `${
                    theme === "dark"
                      ? "var(--dark-color)"
                      : "var(--basic-color)"
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
              <button
                className="btn px-0 bg-transparent border-0"
                onClick={() => setIsSearchOpen(true)}
              >
                <FiSearch />
              </button>
            </li>

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
                className={`dropdown-menu dropdown-menu-${i18n.language === "en"?"end":""}`}
                style={{
                  backgroundColor: `${
                    theme === "dark"
                      ? "var(--dark-color)"
                      : "var(--basic-color)"
                  }`,
                }}
              >
                <li>
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`dropdown-item text-sm ${i18n.language === "ar" && "custom-font"}`}
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
            {user ? (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle bg-transparent border-0 d-flex align-items-center gap-1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  aria-label="Language"
                >
                  {user?.user.type === "company"
                    ? profileCompanyName
                    : profileName}
                  <FiChevronDown />
                </button>
                <ul
                  className={`dropdown-menu dropdown-menu-${i18n.language === "en"?"end":""} overflow-hidden`}
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
                      to="/user_profile"
                      className="d-block"
                    >
                      {t("topnav.profile")}
                    </Link>
                  </li>
                  <li className="dropdown-item text-sm">
                    <Link
                      className="d-block"
                      style={{ color: theme === "dark" ? "#fff" : "#222" }}
                      to={`/provider_profile/${user?.user?.id}`}
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
                    color: `${
                      theme === "dark" ? "var(--basic-color)" : "#000"
                    }`,
                  }}
                >
                  <FiUser />
                </Link>
              </li>
            )}

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

      <div
        className={`side_menu_overlay ${isSideMenuOpen ? "show" : ""}`}
        onClick={() => setIsSideMenuOpen(false)}
      >
        <div
          className={`side_menu ${i18n.language === "ar" ? "rtl" : "ltr"} ${
            isSideMenuOpen ? "open" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="d-flex justify-content-between align-items-center px-3 py-2">
            <Link
              className="navbar-brand"
              to="/"
              onClick={() => setIsSideMenuOpen(false)}
            >
              <img
                src={theme === "dark" ? "/logo-dark.png" : "/logo-white.png"}
                height="55"
                alt="logo"
                onError={(e) => (e.target.src = "/logo-white.png")}
              />
            </Link>
            <button
              className="btn bg-transparent border-0 fs-3"
              onClick={() => setIsSideMenuOpen(false)}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>

          <hr className="mb-2 mt-0" />
          <NavLinks isMobile onCloseMenu={() => setIsSideMenuOpen(false)} />
          <hr className="mb-2 mt-0" />
          {/* maps */}
          <div className="map_icons my-3">
            <Link to="/properties_map" onClick={() => setIsSideMenuOpen(false)}><img src="propMap.png" className="d-block" alt="--"/><div>{t("properties_map")}</div></Link>
            <Link to="/services_map" onClick={() => setIsSideMenuOpen(false)}><img src="adsMap.png" className="d-block" alt="--"/><div>{t("services_map")}</div></Link>
          </div>
        </div>
        
      </div>

      {isSearchOpen && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">{t("home.searchHere")}</h5>
                <button
                  className="btn-close text-xs"
                  onClick={() => setIsSearchOpen(false)}
                ></button>
              </div>

              <div className="d-flex">
                <input
                  type="text"
                  className="form-control"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t("home.searchHere")}
                />

                {/* Dropdown button */}
                <div className="dropdown ms-2">
                  <button
                    className="btn btn-success dropdown-toggle mx-1"
                    type="button"
                    id="modalSearchDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {t("home.searchIn")}
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="modalSearchDropdown"
                  >
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => handleSearch("ads")}
                      >
                        {t("home.ads")}
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => handleSearch("properties")}
                      >
                        {t("home.properties")}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;