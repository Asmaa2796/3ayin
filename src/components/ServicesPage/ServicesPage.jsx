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
import { fetchAllSubCategories } from "../../redux/Slices/FilterServicesSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchAds, filterAds } from "../../redux/Slices/AdsSlice";
import CardsLoader from "../../pages/CardsLoader";

const ServicesPage = () => {
  const { t, i18n } = useTranslation("global");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const dispatch = useDispatch();

  const { filterByCats } = useSelector((state) => state.filterServices);
  const { ads, loading } = useSelector((state) => state.ads);

  //   const handleFilterClick = (subSubId) => {
  //   if (!subSubId) {
  //     // Show all ads
  //     setFilteredAds(ads);
  //     return;
  //   }

  //   const filtered = ads.filter((ad) => {
  //     // Match if ad has a sub-sub-category directly
  //     if (ad.ad_sub_sub_category) {
  //       return ad.ad_sub_sub_category.id === subSubId;
  //     }

  //     // Or match if its sub-category contains the sub-sub-category
  //     return ad.ad_sub_category?.sub_sub_categories?.some(
  //       (sub) => sub.id === subSubId
  //     );
  //   });

  //   setFilteredAds(filtered);
  // };
  const handleFilterClick = (subSubId) => {
    if (!subSubId) {
      dispatch(fetchAds()); // Show all ads
      return;
    }
    dispatch(filterAds({ ad_sub_category_id: subSubId }));
  };

  const handlePriceFilter = () => {
    if (minPrice >= maxPrice) {
      toast.error(t("min_max_price"));
      return;
    }
    dispatch(filterAds({ min_price: minPrice, max_price: maxPrice }));
  };
  const handleRateFilter = (rate) => {
    dispatch(filterAds({ rate }));
  };
  const handleCategoryFilter = (catId) => {
    dispatch(filterAds({ ad_category_id: catId }));
  };
  const handleSubCategoryFilter = (subId) => {
    dispatch(filterAds({ ad_sub_category_id: subId }));
  };
  const handleShowAll = () => {
    handleFilterClick(null);
  };
  useEffect(() => {
    dispatch(fetchAllSubCategories());
    dispatch(fetchAds());
  }, [dispatch, i18n.language]);

  return (
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
                              {/* Category level */}
                              <li>
                                <Link
                                  onClick={() =>
                                    handleCategoryFilter(category.id)
                                  }
                                >
                                  {category.name}
                                </Link>
                              </li>

                              {/* Sub-sub-category level */}
                              {category.sub_sub_categories?.length > 0 &&
                                category.sub_sub_categories.map((sub) => (
                                  <li key={sub.id}>
                                    <Link
                                      onClick={() =>
                                        handleSubCategoryFilter(sub.id)
                                      }
                                    >
                                      {sub.name}
                                    </Link>
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
                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
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
                        e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
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
                  {[5, 4, 3, 2, 1].map((rate) => (
                    <label key={rate} className={`rate_${rate}`}>
                      <input
                        type="radio"
                        name="rate"
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
                          <div className="recommended_card border rounded-4 mb-3 overflow-hidden">
                            <img
                              src={ad.images?.[0]?.image || "/placeholder.jpg"}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder.jpg";
                              }}
                              alt="service"
                              className="img-fluid mb-3 rounded-4"
                            />
                            <div className="p-3">
                              <p className="line-height mb-1">{ad?.ad_name}</p>
                              <small className="mb-2 d-block">
                                {ad?.category_name} / {ad?.sub_category_name}{" "}
                                {ad?.sub_sub_category_name &&
                                  `/ ${ad?.sub_sub_category_name}`}
                              </small>
                              <hr/>

                              <div className="d-inline-block mb-2 rates">
                                {ad?.reviews?.length > 0 ? (
                                  <>
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <i
                                        key={i}
                                        className={`bi bi-star-fill ${
                                          i <
                                          Math.round(
                                            ad.reviews.reduce(
                                              (sum, r) => sum + Number(r.rate),
                                              0
                                            ) / ad.reviews.length
                                          )
                                            ? "text-warning"
                                            : "text-secondary"
                                        }`}
                                      ></i>
                                    ))}
                                    <span className="mx-2">
                                      ({ad.reviews.length || 0})
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    {[...Array(5)].map((_, i) => (
                                      <i
                                        key={i}
                                        className="bi bi-star-fill text-secondary"
                                      ></i>
                                    ))}
                                    <span className="mx-2">(0)</span>
                                  </>
                                )}
                              </div>

                              <div className="text-sm d-flex justify-content-between align-items-center">
                                <div>
                                  {t("recommendedServices.startingFrom")}{" "}
                                  <span className="fw-bold">
                                    {ad?.price}{" "}
                                    {t("recommendedServices.currency")}
                                  </span>
                                </div>
                                <div>
                                  <Link
                                    className="view_details"
                                    to={`/serviceDetails/${ad.id}`}
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
                      ))}
                    </div>
                    <div className="text-center">
                      <Link className="show_more">
                        {t("recommendedServices.showMore")}{" "}
                        <i
                          className={`bi ${
                            i18n.language === "ar"
                              ? "bi-arrow-left"
                              : "bi-arrow-right"
                          }`}
                        ></i>
                      </Link>
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
  );
};

export default ServicesPage;
