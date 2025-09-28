import React, { useEffect } from "react";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";

import { fetchPrivacy } from "../../redux/Slices/PrivacyPolicySlice";
import ContentLoader from "../../pages/ContentLoader";
import { useDispatch, useSelector } from "react-redux";
const PrivacyPolicy = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const { privacyPolicy, isLoading } = useSelector((state) => state.privacyPolicy);
  useEffect(() => {
    dispatch(fetchPrivacy());
  }, [dispatch, i18n.language, t]);
  return (
    <div className="bg_overlay">
      <Breadcrumb title={t("pages.privacy_policy")} />
      <div className="py-5 privacy_policy position-relative">
        <div className="container">
          {isLoading ? (
            <ContentLoader />
          ) : privacyPolicy ? (
            <p>{privacyPolicy?.content}</p>
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

export default PrivacyPolicy;
