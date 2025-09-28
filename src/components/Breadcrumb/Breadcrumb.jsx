import React from "react";
import { Link } from "react-router-dom";
import { FaCaretRight, FaCaretLeft } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import "./Breadcrumb.css";
const Breadcrumb = ({ title, subTitle, pageLink }) => {
  const { t, i18n } = useTranslation("global");
  return (
    <div className="breadcrumb py-5">
      <div className="container">
        <h4 className="fw-bold main-color">{title}</h4>
        <ul className="p-0 mb-0 list-unstyled">
          <li>
            <Link to="/">{t("navbar.home")}</Link>
          </li>
          <li>
            {i18n.language === "ar" ? (
              <FaCaretLeft className="mx-1" />
            ) : (
              <FaCaretRight className="mx-1" />
            )}
          </li>
          {pageLink ? (
            <>
              <li>
                <Link to={`/${pageLink}`}>{title}</Link>
              </li>
            </>
          ) : (
            <li>{title}</li>
          )}
          {subTitle && (
            <>
              <li>
                {i18n.language === "ar" ? (
                  <FaCaretLeft className="mx-1" />
                ) : (
                  <FaCaretRight className="mx-1" />
                )}
              </li>
              <li>
                <span className="active">{subTitle}</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Breadcrumb;
