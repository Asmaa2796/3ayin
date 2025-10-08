import React, { useState, useEffect } from "react";
// import * as bootstrap from "bootstrap";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { BiSolidDashboard } from "react-icons/bi";
import { TiStarHalfOutline } from "react-icons/ti";
import toast, { Toaster } from "react-hot-toast";
import { GrCurrency } from "react-icons/gr";
import "../RecommendedServices/RecommendedServices.css";
import { Link } from "react-router-dom";
import "./ServicesPage.css";
import { fetchAllCategoriesTree } from "../../redux/Slices/FilterServicesSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAds,
  filterAds,
  fetchAdsWithPagination,
} from "../../redux/Slices/AdsSlice";
import CardsLoader from "../../pages/CardsLoader";

const ServicesPage = () => {
  const { t, i18n } = useTranslation("global");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [selectedRate, setSelectedRate] = useState(null);
  const dispatch = useDispatch();

  const { filterByCats } = useSelector((state) => state.filterServices);
  const { ads, loading, pagination, appendAds } = useSelector(
    (state) => state.ads
  );

  const resetAllFilters = () => {
    setMinPrice(0);
    setMaxPrice(100000000);
    setSelectedRate(null);
  };
  const handleFilterClick = (subSubId) => {
    if (!subSubId) {
      dispatch(fetchAds()); // Show all ads
      return;
    }
    resetAllFilters();
    dispatch(filterAds({ ad_sub_category_id: subSubId }));
  };

  const handlePriceFilter = () => {
    if (minPrice >= maxPrice) {
      toast.error(t("min_max_price"));
      return;
    }
    resetAllFilters();
    dispatch(filterAds({ min_price: minPrice, max_price: maxPrice }));
  };
  const handleRateFilter = (rate) => {
    const newRate = selectedRate === rate ? null : rate;
    setSelectedRate(newRate);

    setMinPrice(0);
    setMaxPrice(100000000);

    dispatch(filterAds(newRate ? { rate: newRate } : {}));
  };

  const handleCategoryFilter = (catId) => {
    resetAllFilters();
    dispatch(filterAds({ ad_category_id: catId }));
  };
  const handleSubCategoryFilter = (subId) => {
    resetAllFilters();
    dispatch(filterAds({ ad_sub_category_id: subId }));
  };
  const handleSubSubCategoryFilter = (subSubId) => {
    resetAllFilters();
    dispatch(filterAds({ ad_sub_sub_category_id: subSubId }));
  };
  const handleShowAll = () => {
    handleFilterClick(null);
  };

  const handleShowMore = () => {
    if (pagination && pagination.current_page < pagination.last_page) {
      dispatch(
        fetchAdsWithPagination({
          page: pagination.current_page + 1,
          per_page: pagination.per_page || 9,
        })
      ).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          dispatch(appendAds(res.payload));
        }
      });
    }
  };
  useEffect(() => {
    dispatch(fetchAllCategoriesTree());
    dispatch(fetchAds());
  }, [dispatch, i18n.language]);

  return (
    <>
      <div className="services_page bg_overlay">
        <Breadcrumb title={t("servicesPage.filterServices")} />
        <div className="container">
          <div className="all_services py-5">
            <div className="row position-relative">
              {/* Sidebar Filters */}
              <div className="col-xl-3 col-lg-3 col-md-3 col-12">
                <div className="service_filters">
                  {/* Categories Accordion */}
                  <div className="other_sections mt-0 common">
                    <b className="d-block">
                      <BiSolidDashboard className="text-sm main-color" />{" "}
                      {t("servicesPage.otherSections")}
                    </b>
                    <hr />
                    {/* "All" button */}
                    <ul className="list-unstyled mb-0 p-0">
                      <li>
                        <Link
                          className="text-sm main-color d-block"
                          onClick={handleShowAll}
                        >
                          {t("servicesPage.all")}
                        </Link>
                      </li>
                    </ul>

                    <div className="accordion" id="servicesAccordion">
                      {/* Category items */}
                      {filterByCats?.data?.map((category) => (
                        <div className="accordion-item" key={category.id}>
                          <h2
                            className="accordion-header"
                            id={`heading-${category.id}`}
                          >
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapse-${category.id}`}
                            >
                              {category.name}
                            </button>
                          </h2>

                          <div
                            id={`collapse-${category.id}`}
                            className="accordion-collapse collapse"
                            data-bs-parent="#servicesAccordion"
                          >
                            <div className="accordion-body">
                              <ul className="list-unstyled">
                                {/* Main category filter */}
                                <li>
                                  <Link
                                    onClick={() =>
                                      handleCategoryFilter(category.id)
                                    }
                                  >
                                    {category.name}
                                  </Link>
                                </li>

                                {/* Subcategories */}
                                {category.sub_categories?.map((sub) => (
                                  <li key={sub.id} className="mt-1">
                                    <Link
                                      onClick={() =>
                                        handleSubCategoryFilter(sub.id)
                                      }
                                    >
                                      <i
                                        className="bi bi-square-fill main-color"
                                        style={{ fontSize: "11px" }}
                                      ></i>{" "}
                                      {sub.name}
                                    </Link>

                                    {sub.sub_sub_categories?.length > 0 && (
                                      <ul className="ms-3 mt-1">
                                        {sub.sub_sub_categories.map(
                                          (subSub) => (
                                            <li key={subSub.id}>
                                              <Link
                                                onClick={() =>
                                                  handleSubSubCategoryFilter(
                                                    subSub.id
                                                  )
                                                }
                                              >
                                                {subSub.name}
                                              </Link>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="filter_by_price common">
                    <b className="d-block">
                      <GrCurrency className="text-sm main-color" />{" "}
                      {t("servicesPage.filterByPrice")}
                    </b>
                    <hr />

                    <div className="mb-2">
                      <label className="text-sm my-1">
                        {t("servicesPage.min")}
                      </label>
                      <input
                        type="number"
                        style={{ fontSize: "13px" }}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ); // only digits
                        }}
                        className="form-control"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                      />
                    </div>

                    <div className="mb-2">
                      <label className="text-sm my-1">
                        {t("servicesPage.max")}
                      </label>
                      <input
                        type="number"
                        style={{ fontSize: "13px" }}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ); // only digits
                        }}
                        className="form-control"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-secondary text-sm">
                          {t("servicesPage.min")}
                        </div>
                        <small className="fw-bold">
                          <span>{minPrice}</span>{" "}
                          {t("recommendedServices.currency")}
                        </small>
                      </div>
                      <div>
                        <div className="text-secondary text-sm">
                          {t("servicesPage.max")}
                        </div>
                        <small className="text-danger fw-bold">
                          <span>{maxPrice}</span>{" "}
                          {t("recommendedServices.currency")}
                        </small>
                      </div>
                    </div>
                    <button
                      className="btn btn-sm btn-primary w-100 mt-2"
                      onClick={handlePriceFilter}
                    >
                      {t("servicesPage.applyFilter")}
                    </button>
                  </div>

                  {/* Rating Filter */}
                  <div className="filter_by_rating common">
                    <b className="d-block">
                      <TiStarHalfOutline className="text-sm main-color" />{" "}
                      {t("servicesPage.filterByRating")}
                    </b>
                    <hr />
                    <div className="rate-filters">
                      {[5, 4, 3, 2, 1].map((rate) => (
                        <label key={rate} className={`rate_${rate}`}>
                          <input
                            type="radio"
                            name="rate"
                            checked={selectedRate === rate}
                            onChange={() => handleRateFilter(rate)}
                          />
                          <div className="mx-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <i
                                key={i}
                                className={`bi bi-star-fill ${
                                  i < rate ? "text-warning" : ""
                                }`}
                                style={i < rate ? {} : { color: "#ddd" }}
                              ></i>
                            ))}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ads List */}
              <div className="col-xl-9 col-lg-9 col-md-9 col-12">
                <div className="row">
                  {loading ? (
                    <CardsLoader />
                  ) : ads && ads.length >= 1 ? (
                    <>
                      <div className="row">
                        {ads.map((ad, index) => (
                          <div
                            className="col-xl-4 col-lg-4 col-md-6 col-12"
                            key={ad.id || index}
                          >
                            <Link
                              to={`/serviceDetails/${ad.id}`}
                              className="recommended_card border rounded-4 mb-3 overflow-hidden d-block"
                            >
                              <img
                                src={
                                  ad.images?.[0]?.image || "/placeholder.jpg"
                                }
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/placeholder.jpg";
                                }}
                                alt="service"
                                className="img-fluid mb-3 rounded-4"
                              />
                              <div className="p-3">
                                <p className="line-height mb-1 text-dark">
                                  {ad?.ad_name}
                                </p>
                                <small className="mb-2 d-block text-dark">
                                  {ad?.category_name} / {ad?.sub_category_name}{" "}
                                  {ad?.sub_sub_category_name &&
                                    `/ ${ad?.sub_sub_category_name}`}
                                </small>
                                <hr />

                                <div className="d-inline-block mb-2 rates">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <i
                                      key={i}
                                      className={`bi bi-star-fill ${
                                        i < Number(ad?.average_rate || 0)
                                          ? "text-warning"
                                          : "text-secondary"
                                      }`}
                                    ></i>
                                  ))}
                                  <span className="mx-2 text-dark">
                                    ({ad?.reviews_count || 0})
                                  </span>
                                </div>

                                <div className="text-sm d-flex justify-content-between align-items-center">
                                  <div className="text-dark">
                                    {t("recommendedServices.startingFrom")}{" "}
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
                        ))}
                      </div>
                      <div className="text-center">
                        {pagination && pagination.last_page > 1 && (
                          <div className="text-center">
                            <button
                              className="show_more btn btn-link"
                              onClick={handleShowMore}
                            >
                              {t("recommendedServices.showMore")}{" "}
                              <i
                                className={`bi ${
                                  i18n.language === "ar"
                                    ? "bi-arrow-left"
                                    : "bi-arrow-right"
                                }`}
                              ></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="no_data bg-white py-5 border rounded-2 my-3 text-center">
                      <img
                        src="/empty.png"
                        className="mx-auto my-2"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                        alt="--"
                      />
                      <h5 className="mb-0">{t("no_data_exists")}</h5>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default ServicesPage;
