import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Packages.css";
import { fetchPlans } from "../../redux/Slices/PlansSlice";
import { useDispatch, useSelector } from "react-redux";
import FaqLoader from "../../pages/FaqLoader";
import { useNavigate, useParams } from "react-router-dom";
import { subscribePlan,clearState } from "../../redux/Slices/SubscribePlanSlice";
import { toast } from "react-toastify";

const Packages = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { plans,isLoading } = useSelector((state) => state.plans);
  const { success,error} = useSelector((state) => state.subscribe);
  const { name } = useParams();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user3ayin"));
    if (!user || !user.token) {
      navigate("/login");
    }

    if (name) {
      navigate("/");
    }
  }, [navigate, name]);
  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch, i18n.language]);

  const [loadingPlan, setLoadingPlan] = useState(null);
  const handleSubmit = (planId) => {
    setLoadingPlan(planId);
    console.log("plan",planId);
    dispatch(subscribePlan({ plan_id: planId }))
    .unwrap()
    .then(() => setLoadingPlan(null))
    .catch(() => setLoadingPlan(null));
  };

  useEffect(() => {
    if (success) {
      toast.success(t("subscribed_successfully"));
      dispatch(clearState());
    }

    if (error) {
      toast.error(t("failed_to_subscribe"));
      dispatch(clearState());
    }
  }, [success, error, t, dispatch]);

  const mappedPlans = plans?.map((plan) => ({
    id: plan.id,
    name: plan.plan_name,
    monthlySubscription: plan.price,
    adsCount: plan.ads_limit,
    photosVideos: {
      images: plan.images_limit,
      video: plan.video,
    },
    vrTours: plan.vr_tours,
    searchAppearance: plan.search_priority,
    statisticsReports: plan.reports,
    teamManagement: plan.team_members,

    hasVideo: plan.video === "✅",
    hasVrTours: parseInt(plan.vr_tours) > 0,
    hasSearchAppearance: plan.search_priority,
    hasStatisticsReports: plan.reports,
    hasTeamManagement: plan.team_members,
  }));

  const features = [
    {
      key: "monthlySubscription",
      label: t("packages.features.monthlySubscription"),
    },
    { key: "adsCount", label: t("packages.features.adsCount") },
    { key: "photosVideos", label: t("packages.features.photosVideos") },
    { key: "vrTours", label: t("packages.features.vrTours") },
    { key: "searchAppearance", label: t("packages.features.searchAppearance") },
    {
      key: "statisticsReports",
      label: t("packages.features.statisticsReports"),
    },
    { key: "teamManagement", label: t("packages.features.teamManagement") },
  ];

  const renderFeatureValue = (pkg, featureKey) => {
    switch (featureKey) {
      case "photosVideos":
        return (
          <div>
            <span className="d-block my-1">
              {pkg.hasVideo ? (
                <i className="bi bi-check-circle-fill text-success ms-1"></i>
              ) : (
                <i className="bi bi-x-circle-fill text-danger ms-1"></i>
              )}
              {t("packages.features.video")}
            </span>
            <span className="d-block my-1">
              {pkg.photosVideos.images ? (
                <i className="bi bi-check-circle-fill text-success ms-1"></i>
              ) : (
                <i className="bi bi-x-circle-fill text-danger ms-1"></i>
              )}
              {pkg.photosVideos.images}
            </span>
          </div>
        );

      case "vrTours":
        return pkg.hasVrTours ? (
          <>
            <i className="bi bi-check-circle-fill text-success"></i>{" "}
            {pkg.vrTours}
          </>
        ) : (
          <>
            <i className="bi bi-x-circle-fill text-danger"></i> {pkg.vrTours}
          </>
        );

      case "searchAppearance":
        return pkg.hasSearchAppearance ? (
          <>
            {pkg.searchAppearance}
          </>
        ) : (
          <>
            {pkg.searchAppearance}
          </>
        );

      case "statisticsReports":
        return pkg.hasStatisticsReports ? (
          <>
            {pkg.statisticsReports}
          </>
        ) : (
          <>
            {pkg.statisticsReports}
          </>
        );

      case "teamManagement":
        return pkg.hasTeamManagement === t("packages.features.yes") ? (
          <>
            <i className="bi bi-check-circle-fill text-success"></i>{" "}
            {t("packages.features.yes")}
          </>
        ) : (
          <>
            <i className="bi bi-x-circle-fill text-danger"></i>{" "}
            {t("packages.features.no")}
          </>
        );

      default:
        return pkg[featureKey];
    }
  };


  return (
    <div className="packages-page">
      <div className="container">
        {isLoading ? <div className="bg-white p-4 rounded-3" style={{textAlign:i18n.language === "ar"?"right":"left"}}><FaqLoader/></div>:(
          <div
          className="packages-container bg-white py-3"
          style={{ borderRadius: "40px" }}
        >
          <div className="packages-header">
            <h1 className="packages-title my-3" style={{ fontSize: "40px" }}>
              {t("packages.title")}
            </h1>
          </div>

          <div className="packages-table-container">
            <table className="packages-table">
              <thead>
                <tr>
                  <th className="package-header">
                    {t("packages.features.monthlySubscription")}
                  </th>
                  {mappedPlans?.map((pkg) => (
                    <th key={pkg.id} className="package-name">
                      {pkg.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr key={feature.key}>
                    <td className="feature-label">{feature.label}</td>
                    {mappedPlans?.map((pkg) => (
                      <td
                        key={`${pkg.id}-${feature.key}`}
                        className="feature-value"
                      >
                        {renderFeatureValue(pkg, feature.key)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="subscribe-row">
                  <td className="feature-label"></td>
                  {mappedPlans?.map((pkg) => (
                    <td key={`subscribe-${pkg.id}`} className="subscribe-cell">
                      <button type="button" disabled={loadingPlan === pkg.id} className="subscribe-btn" onClick={() => handleSubmit(pkg.id)}>
                        {loadingPlan === pkg.id ? t("loading") : t("packages.subscribe")}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Packages;
