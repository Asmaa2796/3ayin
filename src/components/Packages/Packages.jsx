import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Packages.css";
import { fetchPlans } from "../../redux/Slices/PlansSlice";
import { useDispatch, useSelector } from "react-redux";
import FaqLoader from "../../pages/FaqLoader";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import {
  subscribePlan,
  clearState,
} from "../../redux/Slices/SubscribePlanSlice";
import { toast } from "react-toastify";
import { customizePackage } from "../../redux/Slices/CustomizePackageSlice";

const Packages = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { plans, isLoading } = useSelector((state) => state.plans);
  const { success, error } = useSelector((state) => state.subscribe);
  const { successed, failed, customize_package } = useSelector(
    (state) => state.customize_package
  );
  const userData = JSON.parse(sessionStorage.getItem("user3ayin"));
  const [customPackage, setCustomPackage] = useState({
    ads_limit: "",
    images_limit: "",
    vr_tours: "",
    video: false,
    search_priority: "normal",
    reports: "none",
    team_members: "0",
  });
  const had_free_subscription = userData?.user?.had_free_subscription;
  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch, i18n.language]);

  const [loadingPlan, setLoadingPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const handleSubmit = (planId) => {
  const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
  if (!token) {
    toast.warning(t("please_log_in_to_continue"));
    return;
  }

  setSelectedPlan(planId);
  setLoadingPlan(planId);

  dispatch(subscribePlan({ plan_id: planId }))
    .unwrap()
    .then((res) => {
      setLoadingPlan(null);

      if (res?.data?.payment_url) {
        window.open(res.data.payment_url, "_blank");
        toast.info(t("please_complete_payment"));
      }
    })
    .catch((err) => {
      setLoadingPlan(null);
      console.error(err);
    });
};


  useEffect(() => {
  if (success) {
    if (selectedPlan === 1) {
      toast.success(t("subscribed_successfully"),{
        onClose: () => {
          navigate("/packages");
        }
      });
    } 
    dispatch(clearState());
  }

  if (error) { 
    let errorMessage = t("failed_to_subscribe");

    if (typeof error === "string") {
      if (error.includes("already subscribed")) {
        errorMessage = t("already_subscribed_free_plan");
      } else {
        errorMessage = error;
      }
    }

    toast.error(errorMessage);
    dispatch(clearState());
  }
}, [success, error, t, dispatch, selectedPlan]);


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

    hasVideo: plan.video,
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
          <>{pkg.searchAppearance}</>
        ) : (
          <>{pkg.searchAppearance}</>
        );

      case "statisticsReports":
        return pkg.hasStatisticsReports ? (
          <>{pkg.statisticsReports}</>
        ) : (
          <>{pkg.statisticsReports}</>
        );

      case "teamManagement":
        return pkg.hasTeamManagement ? (
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

  const handleCustomizeChange = (e) => {
    const { name, value } = e.target;

    let parsedValue = value;

    // Convert "true"/"false" string to boolean for `video`
    if (name === "video") {
      parsedValue = value === "true";
    }

    setCustomPackage((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };
  const submitCustomizePackage = (e) => {
    e.preventDefault();
    const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
    if (!token) {
      toast.warning(t("please_log_in_to_continue"));
      return;
    }
    // console.log("Custom package submitted:", customPackage);
    dispatch(customizePackage(customPackage));
  };

  useEffect(() => {
    if (successed) {
      toast.success(t("custom_package_submitted"));
      dispatch(clearState());
      setTimeout(() => {
        window.location = "/packages";
      }, 1500);
    }

    if (failed) {
      let errorMessage = t("failed_to_submit_form");

      toast.error(errorMessage);
      dispatch(clearState());
    }
  }, [successed, failed, t, dispatch]);
  return (
    <>
      <div className="packages-page">
        <div className="container">
          {isLoading ? (
            <div
              className="bg-white p-4 rounded-3"
              style={{ textAlign: i18n.language === "ar" ? "right" : "left" }}
            >
              <FaqLoader />
            </div>
          ) : (
            <div
              className="packages-container bg-white py-3"
              style={{ borderRadius: "40px" }}
            >
              <Link to="/">
                <img
                  className="d-block mx-auto"
                  style={{
                    width: "130px",
                    height: "130px",
                    objectFit: "cover",
                  }}
                  src="/logo-white.png"
                />
              </Link>

              <div className="packages-header">
                <h1
                  className="packages-title my-3"
                  style={{ fontSize: "30px" }}
                >
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
                      <td className="feature-label">
                        <button
                          className="btn btn-md btn-primary rounded-5 fw-bold px-4 py-3 shadow-sm"
                          data-bs-toggle="modal"
                          data-bs-target="#customizePackage"
                        >
                          <MdOutlineDashboardCustomize />{" "}
                          {t("customize_package")}
                        </button>
                      </td>
                      {mappedPlans?.map((pkg) => (
                        <td
                          key={`subscribe-${pkg.id}`}
                          className="subscribe-cell"
                        >
                          {!(
                            had_free_subscription === true && pkg.id === 1
                          ) && (
                            <button
                              type="button"
                              disabled={loadingPlan === pkg.id}
                              className="subscribe-btn"
                              onClick={() => handleSubmit(pkg.id)}
                            >
                              {loadingPlan === pkg.id
                                ? t("loading")
                                : t("packages.subscribe")}
                            </button>
                          )}
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
      <div
        className="modal fade"
        id="customizePackage"
        tabIndex="-1"
        aria-labelledby="customizePackageLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h1 className="modal-title fs-5" id="customizePackageLabel"></h1>
              <button
                type="button"
                className="btn-close btn-sm text-xs"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h5 className="main-color fw-bold text-center">
                {t("customize_package")}
              </h5>
              <form onSubmit={submitCustomizePackage} className="form-style">
                <div className="row">
                  <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                    <label>{t("packages.features.adsCount")}</label>
                    <input
                      name="ads_limit"
                      value={customPackage.ads_limit}
                      min="0"
                      type="number"
                      required
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                      }}
                      onChange={handleCustomizeChange}
                    />
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                    <label>{t("packages.features.images_limit")}</label>
                    <input
                      name="images_limit"
                      min="0"
                      type="number"
                      required
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                      }}
                      value={customPackage.images_limit}
                      onChange={handleCustomizeChange}
                    />
                  </div>

                  <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                    <label>{t("packages.features.video")}</label>
                    <select
                      name="video"
                      value={customPackage.video}
                      onChange={handleCustomizeChange}
                    >
                      <option value="true">{t("packages.features.yes")}</option>
                      <option value="false">{t("packages.features.no")}</option>
                    </select>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                    <label>{t("packages.features.vr_tours")}</label>
                    <input
                      name="vr_tours"
                      min="0"
                      type="number"
                      required
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                      }}
                      value={customPackage.vr_tours}
                      onChange={handleCustomizeChange}
                    />
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                    <label>{t("packages.features.searchAppearance")}</label>
                    <select
                      name="search_priority"
                      value={customPackage.search_priority}
                      onChange={handleCustomizeChange}
                    >
                      <option value="normal">{t("normal")}</option>
                      <option value="highlighted">{t("highlighted")}</option>
                      <option value="top">{t("top")}</option>
                    </select>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                    <label>{t("packages.features.reports")}</label>
                    <select
                      name="reports"
                      value={customPackage.reports}
                      onChange={handleCustomizeChange}
                    >
                      <option value="none">{t("none")}</option>
                      <option value="basic">{t("basic")}</option>
                      <option value="advanced">{t("advanced")}</option>
                    </select>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                    <label>{t("packages.features.teamManagement")}</label>
                    <select
                      name="team_members"
                      value={customPackage.team_members}
                      onChange={handleCustomizeChange}
                    >
                      <option value="0">{t("packages.features.no")}</option>
                      <option value="1">{t("packages.features.yes")}</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3 w-100">
                  {t("submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Packages;
