import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./ServiceProvider.css";
import { MdWifiCalling3 } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProviderData } from "../../redux/Slices/ProviderDataSlice";
import { getProviderAds } from "../../redux/Slices/ProviderAdsSlice";
import { getProviderAdsReviews } from "../../redux/Slices/ProviderAdsReviewsSlice";
import { getProviderStatistics } from "../../redux/Slices/ProviderStatisticsSlice";
import { fetchSettings } from "../../redux/Slices/SettingsSlice";
import { useDispatch, useSelector } from "react-redux";
import ContentLoader from "../../pages/ContentLoader";
const ServiceProvider = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user3ayin"));
  const userPhone = user?.user?.phone;
  const { isLoading, record: providerDataRecord } = useSelector(
    (state) => state.providerData
  );
  const { record: getProviderAdsRecord } = useSelector(
    (state) => state.providerAds
  );
  const { record: getProviderAdsReviewsRecord } = useSelector(
    (state) => state.providerAdsReviews
  );
  const { record: getProviderStatisticsRecord } = useSelector(
    (state) => state.providerStatistics
  );
  const { settings } = useSelector((state) => state.settings);
  // ads
  const [currentPage, setCurrentPage] = useState(1);
  const adsPerPage = 3;
  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = getProviderAdsRecord?.slice(indexOfFirstAd, indexOfLastAd);
  const totalPages = Math.ceil(getProviderAdsRecord?.length / adsPerPage);
  // reviews

  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const reviewsPerPage = 3;

  const totalReviewPages = Math.ceil(
    getProviderAdsReviewsRecord?.length / reviewsPerPage
  );

  const currentReviews = getProviderAdsReviewsRecord?.slice(
    (currentReviewPage - 1) * reviewsPerPage,
    currentReviewPage * reviewsPerPage
  );

  useEffect(() => {
    dispatch(getProviderData(id));
    dispatch(getProviderAds(id));
    dispatch(getProviderAdsReviews(id));
    dispatch(getProviderStatistics(id));
    dispatch(fetchSettings());
  }, [id, i18n.language, dispatch]);
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
              <div className="text-sm">
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
                <div className="col-xl-9 col-lg-9 col-md-9 col-12">
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
                        id="ratings-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#ratings"
                        type="button"
                        role="tab"
                        aria-controls="ratings"
                        aria-selected="false"
                      >
                        {t("serviceProvider.ratings")}{" "}
                        <span>
                          ({getProviderAdsReviewsRecord?.length || 0})
                        </span>
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
                      <div className="row">
                        {getProviderAdsRecord &&
                        getProviderAdsRecord.length >= 1 ? (
                          currentAds.map((ad, index) => (
                            <div
                              className="col-xl-4 col-lg-4 col-md-6 col-12"
                              key={ad?.id || index}
                            >
                              <div className="recommended_card border rounded-4 mb-3 overflow-hidden">
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
                                  <p className="line-height mb-1">
                                    {ad?.small_desc}
                                  </p>
                                  <small className="mb-2 d-block">
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
                                    <span className="mx-2">
                                      ({ad.reviews_count})
                                    </span>
                                  </div>
                                  <div className="text-sm d-flex justify-content-between align-items-center">
                                    <div>
                                      {t("recommendedServices.startingFrom")}
                                      <span className="fw-bold">
                                        {ad?.price}{" "}
                                        {t("recommendedServices.currency")}
                                      </span>
                                    </div>
                                    <div>
                                      <Link
                                        to={`/serviceDetails/${ad?.id}`}
                                        className="view_details"
                                      >
                                        <i
                                          className={`text-sm bi ${
                                            i18n.language === "ar"
                                              ? "bi-arrow-left"
                                              : "bi-arrow-right"
                                          }`}
                                        ></i>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="no_data bg-white py-5 border rounded-2 my-3 text-center">
                            <h5 className="mb-0">{t("no_data_exists")}</h5>
                          </div>
                        )}
                      </div>
                      {totalPages > 1 && (
                        <div className="text-center my-3 d-flex justify-content-center align-items-center gap-2 flex-wrap">
                          {/* Previous Button */}
                          <button
                            className="btn btn-sm bg-white border text-dark"
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                          >
                            <i
                              className={`bi bi-arrow-${
                                i18n.language === "ar" ? "right" : "left"
                              }`}
                            ></i>
                          </button>

                          {/* Page Buttons */}
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((pageNum) => (
                            <button
                              key={pageNum}
                              className={`btn btn-sm bg-white border ${
                                currentPage === pageNum
                                  ? "main-color"
                                  : "text-dark"
                              }`}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                          ))}

                          {/* Next Button */}
                          <button
                            className="btn btn-sm bg-white border text-dark"
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            disabled={currentPage === totalPages}
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
                      id="ratings"
                      role="tabpanel"
                      aria-labelledby="ratings-tab"
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
                      {totalReviewPages > 1 && (
                        <div className="text-center my-3 d-flex justify-content-center align-items-center gap-2">
                          <button
                            className="btn btn-sm border"
                            onClick={() =>
                              setCurrentReviewPage((p) => Math.max(p - 1, 1))
                            }
                            disabled={currentReviewPage === 1}
                          >
                            <i
                              className={`bi bi-arrow-${
                                i18n.language === "ar" ? "right" : "left"
                              }`}
                            ></i>
                          </button>

                          {Array.from({ length: totalReviewPages }, (_, i) => (
                            <button
                              key={i}
                              className={`btn btn-sm mx-1 bg-white border ${
                                currentReviewPage === i + 1
                                  ? "main-color"
                                  : "text-dark"
                              }`}
                              onClick={() => setCurrentReviewPage(i + 1)}
                            >
                              {i + 1}
                            </button>
                          ))}

                          <button
                            className="btn btn-sm border"
                            onClick={() =>
                              setCurrentReviewPage((p) =>
                                Math.min(p + 1, totalReviewPages)
                              )
                            }
                            disabled={currentReviewPage === totalReviewPages}
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
                <div className="col-xl-3 col-lg-3 col-md-3 col-12">
                  <div className="common text-sm">
                    <b>{t("serviceProvider.statistics")}</b>
                    <hr />
                    <div className="d-flex justify-content-between my-3">
                      <span>{t("serviceProvider.reviews")}</span>
                      <div>
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
                        <span>
                          &nbsp; ({getProviderStatisticsRecord?.reviews_count}){" "}
                          {t("serviceProvider.reviews")}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                      <span>{t("serviceProvider.publishedServices")}</span>
                      <div>({getProviderStatisticsRecord?.ads_count})</div>
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
              <h5 className="mb-0">{t("no_data_exists")}</h5>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServiceProvider;
