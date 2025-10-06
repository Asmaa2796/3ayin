import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaLinkedin, FaBehance, FaFacebook, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { fetchSettings } from "../redux/Slices/SettingsSlice";
import { useDispatch, useSelector } from "react-redux";
const Footer = () => {
  const { t,i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const {settings} = useSelector((state) => state.settings);
   const [theme, setTheme] = useState(() => sessionStorage.getItem("theme") || "light");
  useEffect(() => {
  const updateTheme = () => {
    const savedTheme = sessionStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  };

  window.addEventListener("storage", updateTheme);

  return () => {
    window.removeEventListener("storage", updateTheme);
  };
}, []);
useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch,i18n,t]);
  return (
    <div className="footer py-5">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-3 col-md-6">
            <div className="logo">
              <Link to="/"><img src={theme === "light" ? settings?.logo_light : settings?.logo_dark} alt="--" /></Link>
            </div>
            <p className="line-height">{settings?.site_desc}</p>
            <div className="flex_contact d-flex my-2">
              <div className="d-block">
                <i className="bi bi-chat-text-fill"></i>
              </div>
              <div className="mx-2 d-block">
                <span className="d-block">{t("footer.support")}</span>
                <b className="d-block text-sm">{settings?.email_support}</b>
              </div>
            </div>
            <div className="flex_contact d-flex my-2">
              <div className="d-block">
                <i className="bi bi-telephone-fill"></i>
              </div>
              <div className="mx-2 d-block">
                <span className="d-block">{t("footer.contact")}</span>
                <b className="d-block text-sm">{settings?.site_phone}</b>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-6">
            <div className="links">
              <b className="d-block">{t("footer.quickLinks")}</b>
              <ul className="list-unstyled p-0">
                <li className="mb-2">
                  <Link to="/about">{t("pages.about")}</Link>
                </li>
                <li className="mb-2">
                  <Link to="/how_it_works">{t("pages.howItWorks")}</Link>
                </li>
                <li className="mb-2">
                  <Link to="/all_services">{t("footer.services")}</Link>
                </li>
                <li className="mb-2">
                  <Link to="/packages">{t("packages.title")}</Link>
                </li>
                
              </ul>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-6">
            <div className="links">
              <b className="d-block">{t("footer.myAccount")}</b>
              <ul className="list-unstyled p-0">
                
                <li className="mb-2">
                  <Link to="/terms_and_conditions">{t("footer.terms")}</Link>
                </li>
                <li className="mb-2">
                  <Link to="/privacy_policy">{t("footer.privacy")}</Link>
                </li>
                <li className="mb-2">
                  <Link to="/faq">{t("footer.faq")}</Link>
                </li>
                <li className="mb-2">
                  <Link to="/help_center">{t("pages.helpCenter.helpCenter")}</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-6">
            <div className="links">
              <b className="d-block">{t("footer.socialMedia")}</b>
              <ul className="list-unstyled p-0">
                <li className="mb-2">
                  <a href={settings?.twitter_url} target="_blank">
                    <FaXTwitter className="me-2 mx-2"/>
                    {t("footer.social.twitter")}
                  </a>
                </li>
                <li className="mb-2">
                  <a href={settings?.linkedin_url} target="_blank">
                    <FaLinkedin className="me-2 mx-2" />
                    {t("footer.social.linkedin")}
                  </a>
                </li>
                <li className="mb-2">
                  <a href={settings?.behance_url} target="_blank">
                    <FaBehance className="me-2 mx-2" />
                    {t("footer.social.behance")}
                  </a>
                </li>
                <li className="mb-2">
                  <a href={settings?.facebook_url} target="_blank">
                    <FaFacebook className="me-2 mx-2" />
                    {t("footer.social.facebook")}
                  </a>
                </li>
                <li className="mb-2">
                  <a  href={settings?.youtube_url} target="_blank">
                    <FaYoutube className="me-2 mx-2" />
                    {t("footer.social.youtube")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12">
            <div className="copyright py-2 text-center">
              <span>
                &copy; {new Date().getFullYear()} {t("footer.copyright")}
              </span>{" "}
              <a
                className="main-color"
                href="https://brmja.tech/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("footer.poweredBy")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
