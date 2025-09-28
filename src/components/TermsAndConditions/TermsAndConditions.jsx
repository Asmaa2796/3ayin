import React, { useEffect } from "react";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";

import { fetchTerms } from "../../redux/Slices/TermsAndConditionsSlice";
import ContentLoader from "../../pages/ContentLoader";
import { useDispatch, useSelector } from "react-redux";
const TermsAndConditions = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const { termsConditions, isLoading } = useSelector((state) => state.termsConditions);
  useEffect(() => {
    dispatch(fetchTerms());
  }, [dispatch, i18n.language, t]);
  return (
    <div className="bg_overlay">
      <Breadcrumb title={t("pages.terms_and_conditions")} />
      <div className="py-5 terms_and_conditions position-relative">
        <div className="container">
          {isLoading ? (
            <ContentLoader />
          ) : termsConditions ? (
            <p>{termsConditions?.content}</p>
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

export default TermsAndConditions;
