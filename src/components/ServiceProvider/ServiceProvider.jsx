import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./ServiceProvider.css";
import { MdWifiCalling3 } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProviderData } from "../../redux/Slices/ProviderDataSlice";
import { getProviderAds } from "../../redux/Slices/ProviderAdsSlice";
import { getProviderProperties } from "../../redux/Slices/ProviderPropertiesSlice";
import { getProviderAdsReviews } from "../../redux/Slices/ProviderAdsReviewsSlice";
import { getProviderStatistics } from "../../redux/Slices/ProviderStatisticsSlice";
import { fetchSettings } from "../../redux/Slices/SettingsSlice";
import { useDispatch, useSelector } from "react-redux";
import ContentLoader from "../../pages/ContentLoader";
import { getProviderPropertiesReviews } from "../../redux/Slices/ProviderPropertiesReviewsSlice";
const ServiceProvider = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user3ayin"));
  const [tab, setTab] = useState("pending");
  const [status, setStatus] = useState("pending");

  const userPhone = user?.user?.phone;
  const { isLoading, record: providerDataRecord } = useSelector(
    (state) => state.providerData
  );
  const {
    providerAds,
    pagination,
    isLoading: loading,
  } = useSelector((state) => state.providerAds);
  const {
    providerProperties,
    paginationProps,
    isLoading: loadingProps,
  } = useSelector((state) => state.providerProperties);
  const { providerAdsReviews, pagination: paginationReviews } = useSelector(
    (state) => state.providerAdsReviews
  );
  const { providerPropertiesReviews, pagination: paginationPropsReviews } =
    useSelector((state) => state.providerPropertiesReviews);
  const { record: getProviderStatisticsRecord } = useSelector(
    (state) => state.providerStatistics
  );
  const { settings } = useSelector((state) => state.settings);
  // services pagination
  const [currentAdsPage, setCurrentAdsPage] = useState(1);

  // properties pagination
  const [currentPropsPage, setCurrentPropsPage] = useState(1);

  // reviews pagination
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [currentPropsReviewPage, setCurrentPropsReviewPage] = useState(1);
  const reviewsPerPage = 3;
  const propsreviewsPerPage = 3;

  const currentReviews = providerAdsReviews?.slice(
    (currentReviewPage - 1) * reviewsPerPage,
    currentReviewPage * reviewsPerPage
  );
  const currentPropsReviews = providerPropertiesReviews?.slice(
    (currentPropsReviewPage - 1) * propsreviewsPerPage,
    currentPropsReviewPage * propsreviewsPerPage
  );
  useEffect(() => {
    dispatch(getProviderData(id));
    dispatch(getProviderAdsReviews());
    dispatch(getProviderPropertiesReviews());
    dispatch(getProviderStatistics(id));
    dispatch(fetchSettings());
  }, [id, i18n.language, dispatch]);
  useEffect(() => {
    if (id) {
      dispatch(getProviderAds({ status: tab, page: currentAdsPage }));
    }
  }, [id, tab, currentAdsPage, dispatch, i18n.language]);
  useEffect(() => {
    if (id) {
      dispatch(
        getProviderProperties({ status: status, page: currentPropsPage })
      );
    }
  }, [id, status, currentPropsPage, dispatch, i18n.language]);

  useEffect(() => {
    dispatch(getProviderAdsReviews({ page: currentReviewPage }));
  }, [dispatch, currentReviewPage, i18n.language]);
  const categoryMap = {
    sale: t("property.sale"),
    rent: t("property.rent"),
    share: t("property.share"),
  };
  const unitTypeMap = {
    apartment: t("property.apartment"),
    building: t("property.building"),
    villa: t("property.villa"),
    duplex: t("property.duplex"),
    office: t("property.office"),
    shop: t("property.shop"),
    warehouse: t("property.warehouse"),
    land: t("property.land"),
    chalet: t("property.chalet"),
  };
  return (
    <>
      <div className="service_provider position-relative">
        <div className="provider_profile py-5">
          <div className="container">
            <div className="img">
              <img
                src={providerDataRecord?.image || "/user.webp"}
                style={{ height: "60px", width: "60px", objectFit: "cover" }}
                alt="--"
              />
            </div>

            <div className="info">
              <h3 className="fw-bold">{providerDataRecord?.name}</h3>
              <div className="text-sm d-none">
                {[...Array(5)].map((_, idx) => {
                  const fullStar =
                    idx + 1 <=
                    Math.floor(getProviderStatisticsRecord?.average_rate);
                  const halfStar =
                    idx + 1 >
                      Math.floor(getProviderStatisticsRecord?.average_rate) &&
                    idx + 1 <= getProviderStatisticsRecord?.average_rate;

                  return (
                    <i
                      key={idx}
                      className={`bi ${
                        fullStar
                          ? "bi-star-fill text-warning"
                          : halfStar
                          ? "bi-star-half text-warning"
                          : "bi-star text-secondary"
                      }`}
                    />
                  );
                })}
                <span>
                  &nbsp; ({getProviderStatisticsRecord?.reviews_count}){" "}
                  {t("serviceProvider.reviews")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          {isLoading ? (
            <ContentLoader className="py-5" />
          ) : providerDataRecord ? (
            <div className="provider_info bg_overlay py-5">
              <div className="row position-relative">
                <div className="col-xl-9 col-lg-9 col-md-12 col-12">
                  {/* tabs */}
                  <ul
                    className="nav nav-tabs justify-content-center"
                    id="myTab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="profile-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#profile"
                        type="button"
                        role="tab"
                        aria-controls="profile"
                        aria-selected="true"
                      >
                        {t("serviceProvider.profile")}
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="services-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#services"
                        type="button"
                        role="tab"
                        aria-controls="services"
                        aria-selected="false"
                      >
                        {t("serviceProvider.services")}
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="properties-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#properties"
                        type="button"
                        role="tab"
                        aria-controls="properties"
                        aria-selected="false"
                      >
                        {t("home.properties")}
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="ads_reviews-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#ads_reviews"
                        type="button"
                        role="tab"
                        aria-controls="ads_reviews"
                        aria-selected="false"
                      >
                        {t("serviceProvider.ads_reviews")}{" "}
                        <span>({providerAdsReviews?.length || 0})</span>
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="properties_reviews-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#properties_reviews"
                        type="button"
                        role="tab"
                        aria-controls="properties_reviews"
                        aria-selected="false"
                      >
                        {t("serviceProvider.properties_reviews")}{" "}
                        <span>({providerPropertiesReviews?.length || 0})</span>
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade show active p-3"
                      id="profile"
                      role="tabpanel"
                      aria-labelledby="profile-tab"
                    >
                      <p className="line-height">{providerDataRecord?.bio}</p>
                    </div>
                    <div
                      className="tab-pane fade p-3"
                      id="services"
                      role="tabpanel"
                      aria-labelledby="services-tab"
                    >
                      <div className="tab_status">
                        <button
                          className={tab === "pending" ? "active" : ""}
                          onClick={() => setTab("pending")}
                        >
                          {t("pending")}
                        </button>
                        <button
                          className={tab === "approved" ? "active" : ""}
                          onClick={() => setTab("approved")}
                        >
                          {t("approved")}
                        </button>
                      </div>

                      <div className="row">
                        {loading ? (
                          <ContentLoader />
                        ) : providerAds && providerAds.length >= 1 ? (
                          providerAds.map((ad, index) => (
                            <div
                              className="col-xl-4 col-lg-4 col-md-6 col-12"
                              key={ad?.id || index}
                            >
                              <Link
                                to={`/serviceDetails/${ad?.id}`}
                                className="recommended_card border rounded-4 mb-3 overflow-hidden d-block"
                              >
                                <img
                                  src={
                                    ad?.image?.trim()
                                      ? ad?.image
                                      : "/placeholder.jpg"
                                  }
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/placeholder.jpg";
                                  }}
                                  alt={ad?.ad_name}
                                  className="img-fluid mb-3 rounded-4"
                                />
                                <div className="p-3">
                                  <p className="line-height mb-1 text-dark">
                                    {ad?.ad_name}
                                  </p>
                                  <small className="mb-2 d-block text-dark">
                                    {ad?.category_name} /{" "}
                                    {ad?.sub_category_name}
                                  </small>
                                  <div className="d-inline-block mb-2 rates">
                                    {[...Array(5)].map((_, i) => (
                                      <i
                                        key={i}
                                        className={`bi bi-star-fill ${
                                          i < ad.average_rate
                                            ? "text-warning"
                                            : "text-secondary"
                                        }`}
                                      ></i>
                                    ))}
                                    <span className="mx-2 text-dark">
                                      ({ad.reviews_count})
                                    </span>
                                  </div>
                                  <div className="text-sm d-flex justify-content-between align-items-center">
                                    <div className="text-dark">
                                      {t("recommendedServices.startingFrom")}
                                      <span className="fw-bold">
                                        {ad?.price}{" "}
                                        {t("recommendedServices.currency")}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="view_details">
                                        <i
                                          className={`text-sm bi ${
                                            i18n.language === "ar"
                                              ? "bi-arrow-left"
                                              : "bi-arrow-right"
                                          }`}
                                        ></i>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          ))
                        ) : (
                          <div className="no_data bg-white py-5 border rounded-2 my-3 text-center">
                            <h5 className="mb-0 text-sm">
                              {t("no_data_exists")}
                            </h5>
                          </div>
                        )}
                      </div>
                      {pagination?.last_page > 1 && (
                        <div className="text-center my-3 d-flex justify-content-center gap-2 flex-wrap">
                          <button
                            className="btn btn-sm bg-white border text-dark"
                            onClick={() =>
                              setCurrentAdsPage((prev) => prev - 1)
                            }
                            disabled={pagination.current_page === 1}
                          >
                            <i
                              className={`bi bi-arrow-${
                                i18n.language === "ar" ? "right" : "left"
                              }`}
                            ></i>
                          </button>

                          {Array.from(
                            { length: pagination.last_page },
                            (_, i) => (
                              <button
                                key={i}
                                className={`btn btn-sm bg-white border ${
                                  pagination.current_page === i + 1
                                    ? "main-color"
                                    : "text-dark"
                                }`}
                                onClick={() => setCurrentAdsPage(i + 1)}
                              >
                                {i + 1}
                              </button>
                            )
                          )}

                          <button
                            className="btn btn-sm bg-white border text-dark"
                            onClick={() =>
                              setCurrentAdsPage((prev) => prev + 1)
                            }
                            disabled={
                              pagination.current_page === pagination.last_page
                            }
                          >
                            <i
                              className={`bi bi-arrow-${
                                i18n.language === "ar" ? "left" : "right"
                              }`}
                            ></i>
                          </button>
                        </div>
                      )}
                    </div>
                    <div
                      className="tab-pane fade p-3"
                      id="properties"
                      role="tabpanel"
                      aria-labelledby="properties-tab"
                    >
                      <div className="tab_status">
                        <button
                          className={status === "pending" ? "active" : ""}
                          onClick={() => setStatus("pending")}
                        >
                          {t("pending")}
                        </button>
                        <button
                          className={status === "published" ? "active" : ""}
                          onClick={() => setStatus("published")}
                        >
                          {t("approved")}
                        </button>
                      </div>

                      <div className="row">
                        {loadingProps ? (
                          <ContentLoader />
                        ) : providerProperties &&
                          providerProperties.length >= 1 ? (
                          providerProperties.map((item, index) => (
                            <div
                              className="col-xl-4 col-lg-4 col-md-6 col-12"
                              key={item.id || index}
                            >
                              <Link
                                to={`/propertyDetails/${item.id}`}
                                className="recommended_card border rounded-4 my-2 overflow-hidden position-relative d-block"
                              >
                                <div className="finishing_status">
                                  {item?.status === "pending"
                                    ? t("pending")
                                    : t("approved")}
                                </div>
                                <img
                                  src={
                                    item.images?.[0]?.url || "/placeholder.jpg"
                                  }
                                  alt={item.title}
                                  className="img-fluid mb-3 rounded-4"
                                />
                                <div className="p-3">
                                  <p className="line-height mb-1 text-dark">
                                    {item?.title?.slice(0, 60)} ...
                                  </p>
                                  <hr className="my-1" />
                                  <ul className="p-0 mb-0 list-unstyled">
                                    <li className="text-sm bg-blue text-white d-block text-center rounded-5 px-2 py-1 my-1 mx-3">
                                      <small>
                                        {t("property.unitCategory")}
                                      </small>{" "}
                                      :{" "}
                                      <small>
                                        {categoryMap[item?.category] ||
                                          item?.category}
                                      </small>
                                    </li>
                                    <li className="text-sm bg-success text-white d-block text-center rounded-5 px-2 py-1 my-1 mx-3">
                                      <small>{t("property.unitType")}</small> :{" "}
                                      <small>
                                        {unitTypeMap[item?.unit_type] ||
                                          item?.unit_type}
                                      </small>
                                    </li>
                                  </ul>
                                  <hr className="my-1" />

                                  <div className="text-sm d-flex justify-content-between align-items-center">
                                    <div className="text-dark">
                                      {t("recommendedServices.startingFrom")}{" "}
                                      <span className="fw-bold">
                                        {item.price}{" "}
                                        {t("recommendedServices.currency")}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="view_details">
                                        <i
                                          className={`text-sm bi ${
                                            i18n.language === "ar"
                                              ? "bi-arrow-left"
                                              : "bi-arrow-right"
                                          }`}
                                        ></i>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          ))
                        ) : (
                          <div className="no_data bg-white py-5 border rounded-2 my-3 text-center">
                            <h5 className="mb-0 text-sm">
                              {t("no_data_exists")}
                            </h5>
                          </div>
                        )}
                      </div>
                      {paginationProps?.last_page > 1 && (
                        <div className="text-center my-3 d-flex justify-content-center gap-2 flex-wrap">
                          <button
                            className="btn btn-sm bg-white border text-dark"
                            onClick={() =>
                              setCurrentPropsPage((prev) => prev - 1)
                            }
                            disabled={paginationProps.current_page === 1}
                          >
                            <i
                              className={`bi bi-arrow-${
                                i18n.language === "ar" ? "right" : "left"
                              }`}
                            ></i>
                          </button>

                          {Array.from(
                            { length: paginationProps.last_page },
                            (_, i) => (
                              <button
                                key={i}
                                className={`btn btn-sm bg-white border ${
                                  paginationProps.current_page === i + 1
                                    ? "main-color"
                                    : "text-dark"
                                }`}
                                onClick={() => setCurrentPropsPage(i + 1)}
                              >
                                {i + 1}
                              </button>
                            )
                          )}

                          <button
                            className="btn btn-sm bg-white border text-dark"
                            onClick={() =>
                              setCurrentPropsPage((prev) => prev + 1)
                            }
                            disabled={
                              paginationProps.current_page ===
                              paginationProps.last_page
                            }
                          >
                            <i
                              className={`bi bi-arrow-${
                                i18n.language === "ar" ? "left" : "right"
                              }`}
                            ></i>
                          </button>
                        </div>
                      )}
                    </div>
                    <div
                      className="tab-pane fade p-3"
                      id="ads_reviews"
                      role="tabpanel"
                      aria-labelledby="ads_reviews-tab"
                    >
                      {currentReviews?.map((review, i) => (
                        <div className="rate_wrapper mb-3" key={i}>
                          <div className="row">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-12">
                              <img
                                src={review?.user?.image || "/user.webp"}
                                style={{ borderRadius: "50%" }}
                                alt="--"
                                className="d-block my-2"
                              />
                            </div>
                            <div className="col-xl-7 col-lg-7 col-md-7 col-12">
                              <b>{review?.user?.name}</b>
                              <p>{review?.created_at}</p>
                              <p className="line-height">{review?.comment}</p>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-3 col-12">
                              <div className="mb-1 text-center">
                                {[...Array(5)].map((_, idx) => (
                                  <i
                                    key={idx}
                                    className={`bi ${
                                      idx < Number(review?.rate)
                                        ? "bi-star-fill text-warning"
                                        : "bi-star text-secondary"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Pagination */}
                      {paginationReviews?.last_page > 1 && (
                        <div className="text-center my-3 d-flex justify-content-center align-items-center gap-2">
                          <button
                            className="btn btn-sm border"
                            onClick={() =>
                              setCurrentReviewPage((p) => Math.max(p - 1, 1))
                            }
                            disabled={paginationReviews.current_page === 1}
                          >
                            <i
                              className={`bi bi-arrow-${
                                i18n.language === "ar" ? "right" : "left"
                              }`}
                            ></i>
                          </button>

                          {Array.from(
                            { length: paginationReviews.last_page },
                            (_, i) => (
                              <button
                                key={i}
                                className={`btn btn-sm mx-1 bg-white border ${
                                  paginationReviews.current_page === i + 1
                                    ? "main-color"
                                    : "text-dark"
                                }`}
                                onClick={() => setCurrentReviewPage(i + 1)}
                              >
                                {i + 1}
                              </button>
                            )
                          )}

                          <button
                            className="btn btn-sm border"
                            onClick={() =>
                              setCurrentReviewPage((p) =>
                                Math.min(p + 1, paginationReviews.last_page)
                              )
                            }
                            disabled={
                              paginationReviews.current_page ===
                              paginationReviews.last_page
                            }
                          >
                            <i
                              className={`bi bi-arrow-${
                                i18n.language === "ar" ? "left" : "right"
                              }`}
                            ></i>
                          </button>
                        </div>
                      )}
                    </div>
                    <div
                      className="tab-pane fade p-3"
                      id="properties_reviews"
                      role="tabpanel"
                      aria-labelledby="properties_reviews-tab"
                    >
                      {currentPropsReviews?.map((review, i) => (
                        <div className="rate_wrapper mb-3" key={i}>
                          <div className="row">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-12">
                              <img
                                src={review?.user?.image || "/user.webp"}
                                style={{ borderRadius: "50%" }}
                                alt="--"
                                className="d-block my-2"
                              />
                            </div>
                            <div className="col-xl-7 col-lg-7 col-md-7 col-12">
                              <b>{review?.user?.name}</b>
                              <p>{review?.created_at}</p>
                              <p className="line-height">{review?.comment}</p>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-3 col-12">
                              <div className="mb-1 text-center">
                                {[...Array(5)].map((_, idx) => (
                                  <i
                                    key={idx}
                                    className={`bi ${
                                      idx < Number(review?.rate)
                                        ? "bi-star-fill text-warning"
                                        : "bi-star text-secondary"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Pagination */}
                      {paginationPropsReviews?.last_page > 1 && (
                        <div className="text-center my-3 d-flex justify-content-center align-items-center gap-2">
                          <button
                            className="btn btn-sm border"
                            onClick={() =>
                              setCurrentPropsReviewPage((p) =>
                                Math.max(p - 1, 1)
                              )
                            }
                            disabled={paginationPropsReviews.current_page === 1}
                          >
                            <i
                              className={`bi bi-arrow-${
                                i18n.language === "ar" ? "right" : "left"
                              }`}
                            ></i>
                          </button>

                          {Array.from(
                            { length: paginationPropsReviews.last_page },
                            (_, i) => (
                              <button
                                key={i}
                                className={`btn btn-sm mx-1 bg-white border ${
                                  paginationPropsReviews.current_page === i + 1
                                    ? "main-color"
                                    : "text-dark"
                                }`}
                                onClick={() => setCurrentPropsReviewPage(i + 1)}
                              >
                                {i + 1}
                              </button>
                            )
                          )}

                          <button
                            className="btn btn-sm border"
                            onClick={() =>
                              setCurrentPropsReviewPage((p) =>
                                Math.min(
                                  p + 1,
                                  paginationPropsReviews.last_page
                                )
                              )
                            }
                            disabled={
                              paginationPropsReviews.current_page ===
                              paginationPropsReviews.last_page
                            }
                          >
                            <i
                              className={`bi bi-arrow-${
                                i18n.language === "ar" ? "left" : "right"
                              }`}
                            ></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-12 col-12">
                  <div className="common text-sm">
                    <b>{t("serviceProvider.statistics")}</b>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center my-3">
                      <span>{t("home.ads")}</span>
                      <div className="d-block text-center">
                        {[...Array(5)].map((_, idx) => {
                          const fullStar =
                            idx + 1 <=
                            Math.floor(
                              getProviderStatisticsRecord?.average_rate
                            );
                          const halfStar =
                            idx + 1 >
                              Math.floor(
                                getProviderStatisticsRecord?.average_rate
                              ) &&
                            idx + 1 <=
                              getProviderStatisticsRecord?.average_rate;

                          return (
                            <i
                              key={idx}
                              className={`bi ${
                                fullStar
                                  ? "bi-star-fill text-warning"
                                  : halfStar
                                  ? "bi-star-half text-warning"
                                  : "bi-star text-secondary"
                              }`}
                            />
                          );
                        })}
                        <span className="d-block text-center">
                          &nbsp; ({getProviderStatisticsRecord?.average_rate}){" "}
                          {t("serviceProvider.average_rate")}
                        </span>
                      </div>
                    </div>
                     <div className="d-flex justify-content-between align-items-center my-3">
                        <span>{t("home.properties")}</span>
                        <div className="d-block text-center">
                          {[...Array(5)].map((_, idx) => {
                            const fullStar =
                              idx + 1 <=
                              Math.floor(
                                getProviderStatisticsRecord?.properties_average_rate
                              );
                            const halfStar =
                              idx + 1 >
                                Math.floor(
                                  getProviderStatisticsRecord?.properties_average_rate
                                ) &&
                              idx + 1 <=
                                getProviderStatisticsRecord?.properties_average_rate;

                            return (
                              <i
                                key={idx}
                                className={`bi ${
                                  fullStar
                                    ? "bi-star-fill text-warning"
                                    : halfStar
                                    ? "bi-star-half text-warning"
                                    : "bi-star text-secondary"
                                }`}
                              />
                            );
                          })}
                          <span className="d-block text-center">
                            &nbsp; (
                            {
                              getProviderStatisticsRecord?.properties_average_rate
                            }
                            ) {t("serviceProvider.average_rate")}
                          </span>
                        </div>
                      </div>
                    <div className="d-flex justify-content-between my-3">
                      <span>{t("serviceProvider.publishedServices")}</span>
                      <div>({getProviderStatisticsRecord?.ads_count})</div>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                      <span>{t("serviceProvider.publishedProperties")}</span>
                      <div>
                        ({getProviderStatisticsRecord?.properties_count})
                      </div>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                      <span>{t("serviceProvider.registrationDate")}</span>
                      <div>{getProviderStatisticsRecord?.registered}</div>
                    </div>
                    <div>
                      <span className="my-2 d-block">
                        {t("serviceProvider.companyAddress")} :
                      </span>
                      <div>{settings?.site_address}</div>
                    </div>
                  </div>
                  <div className="common text-sm ribbon">
                    <b>{t("serviceProvider.package")}</b>
                    <hr />
                    <div className="ribbon-wrapper">
                      <div className="glow">&nbsp;</div>
                      <div className="ribbon-front fw-bold">
                        {i18n.language === "ar"
                          ? JSON.parse(sessionStorage.getItem("user3ayin"))
                              ?.user?.subscription?.plan_name_ar
                          : JSON.parse(sessionStorage.getItem("user3ayin"))
                              ?.user?.subscription?.plan_name_en}
                      </div>
                      <div className="ribbon-edge-topleft"></div>
                      <div className="ribbon-edge-topright"></div>
                      <div className="ribbon-edge-bottomleft"></div>
                      <div className="ribbon-edge-bottomright"></div>
                    </div>

                    <div className="d-flex justify-content-between my-3">
                      <span>{t("packages.features.adsCount")}</span>
                      <div>
                        {
                          JSON.parse(sessionStorage.getItem("user3ayin"))?.user
                            ?.subscription?.ads_limit
                        }
                      </div>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                      <span>{t("packages.features.images_limit")}</span>
                      <div>
                        {
                          JSON.parse(sessionStorage.getItem("user3ayin"))?.user
                            ?.subscription?.images_limit
                        }
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between my-3">
                      <span>{t("packages.features.vr_tours")}</span>
                      <div>
                        {
                          JSON.parse(sessionStorage.getItem("user3ayin"))?.user
                            ?.subscription?.vr_tours
                        }
                      </div>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                      <span>{t("packages.features.video")}</span>
                      <div>
                        {JSON.parse(sessionStorage.getItem("user3ayin"))?.user
                          ?.subscription?.video === true ? (
                          <span>
                            <i className="bi bi-check-circle-fill text-success ms-1"></i>
                            {t("packages.features.yes")}
                          </span>
                        ) : (
                          <span>
                            {" "}
                            <i className="bi bi-x-circle-fill text-danger ms-1"></i>
                            {t("packages.features.no")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                      <span>{t("packages.features.teamManagement")}</span>
                      <div>
                        {JSON.parse(sessionStorage.getItem("user3ayin"))?.user
                          ?.subscription?.team_members === "1" ? (
                          <span>
                            <i className="bi bi-check-circle-fill text-success ms-1"></i>
                            {t("packages.features.yes")}
                          </span>
                        ) : (
                          <span>
                            {" "}
                            <i className="bi bi-x-circle-fill text-danger ms-1"></i>
                            {t("packages.features.no")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                      <span>{t("packages.features.reports")}</span>
                      <div>
                        {(() => {
                          const reports = JSON.parse(
                            sessionStorage.getItem("user3ayin")
                          )?.user?.subscription?.reports;
                          if (!reports) return t("none"); // fallback

                          // Translate based on value
                          switch (reports) {
                            case "none":
                              return t("none");
                            case "basic":
                              return t("basic");
                            case "advanced":
                              return t("advanced");
                            default:
                              return reports;
                          }
                        })()}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between my-3">
                      <span>{t("packages.features.searchAppearance")}</span>
                      <div>
                        {(() => {
                          const search = JSON.parse(
                            sessionStorage.getItem("user3ayin")
                          )?.user?.subscription?.search_priority;
                          if (!search) return t("normal"); // fallback

                          switch (search) {
                            case "normal":
                              return t("normal");
                            case "highlighted":
                              return t("highlighted");
                            case "top":
                              return t("top");
                            default:
                              return search;
                          }
                        })()}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between my-3">
                      <span>{t("serviceProvider.end_date")}</span>
                      <div>
                        {
                          JSON.parse(sessionStorage.getItem("user3ayin"))?.user
                            ?.subscription?.end_date
                        }
                      </div>
                    </div>
                  </div>
                  <div className="text-center my-3">
                    <Link
                      to={`tel:${
                        getProviderStatisticsRecord?.phone || userPhone
                      }`}
                      className="contact d-block"
                    >
                      <MdWifiCalling3 /> {t("serviceProvider.contact")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no_data bg-white py-5 border rounded-2 my-3 text-center">
              <h5 className="mb-0 text-sm">{t("no_data_exists")}</h5>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServiceProvider;
