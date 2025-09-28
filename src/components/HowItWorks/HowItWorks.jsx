import React, { useEffect } from "react";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";

import { fetchHowItWorks } from "../../redux/Slices/HowItWorksSlice";
import ContentLoader from "../../pages/ContentLoader";
import { useDispatch, useSelector } from "react-redux";
const HowItWorks = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const { howItWorks, isLoading } = useSelector((state) => state.howItWorks);
  useEffect(() => {
    dispatch(fetchHowItWorks());
  }, [dispatch, i18n.language, t]);
  return (
    <div className="bg_overlay">
      <Breadcrumb title={t("pages.howItWorks")} />
      <div className="py-5 how_it_works position-relative">
        <div className="container">
          {isLoading ? (
            <ContentLoader />
          ) : howItWorks ? (
            <div className="plan-details my-3">
              {howItWorks?.desc?.split("\n").map((line, idx) => (
                <p key={idx} className="mb-2">
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <div className="no_data bg-white py-5 border rounded-2 my-3 text-center">
              <h5 className="mb-0">{t("no_data_exists")}</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
