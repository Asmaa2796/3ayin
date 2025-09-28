import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CardsLoader from "../../pages/CardsLoader";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { fetchAds, fetchAdsWithPagination } from "../../redux/Slices/AdsSlice";

const AdsPage = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();

  const { ads, isLoading, pagination } = useSelector((state) => state.ads);

  const [searchParams] = useSearchParams();
  const searchValue = searchParams.get("search");
  const [page, setPage] = useState(1);

  // 🔹 fetch paginated ads when page or language changes
 useEffect(() => {
  if (searchValue) {
    // 🔹 Fetch ALL ads when searching
    dispatch(fetchAds()); 
  } else {
    // 🔹 Normal backend pagination
    dispatch(fetchAdsWithPagination({ page, per_page: 9 }));
  }
}, [dispatch, page, i18n.language, searchValue]);
const showAds = searchValue
  ? ads.filter(ad =>
      ad.ad_name.toLowerCase().includes(searchValue.toLowerCase())
    )
  : ads;
  const startIndex = (page - 1) * 9;
const paginatedAds = searchValue 
  ? showAds.slice(startIndex, startIndex + 9) 
  : showAds;
  const isDataLoading = isLoading;

  const renderAdCard = (ad, index) => (
    <div className="col-xl-3 col-lg-3 col-md-4 col-12" key={ad.id || index}>
      <div className="recommended_card border rounded-4 mb-3 overflow-hidden">
        <img
          src={ad?.images?.[0]?.image || "/placeholder.jpg"}
          alt="service"
          className="img-fluid mb-3 rounded-4"
        />
        <div className="p-3">
          <p className="line-height mb-1">{ad?.ad_name}</p>
          <small className="mb-2 d-block">
            {ad?.ad_category?.name} / {ad?.ad_sub_category?.name}
          </small>

          <div className="d-inline-block mb-2 rates">
            {ad?.reviews?.length > 0 ? (
              <>
                {Array.from({ length: 5 }, (_, i) => (
                  <i
                    key={i}
                    className={`bi bi-star-fill ${
                      i <
                      Math.round(
                        ad.reviews.reduce((sum, r) => sum + Number(r.rate), 0) /
                          ad.reviews.length
                      )
                        ? "text-warning"
                        : "text-secondary"
                    }`}
                  ></i>
                ))}
                <span className="mx-2">({ad.reviews.length || 0})</span>
              </>
            ) : (
              <>
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="bi bi-star-fill text-secondary"></i>
                ))}
                <span className="mx-2">(0)</span>
              </>
            )}
          </div>

          <div className="text-sm d-flex justify-content-between align-items-center">
            <div>
              {t("recommendedServices.startingFrom")}{" "}
              <span className="fw-bold">
                {ad?.price} {t("recommendedServices.currency")}
              </span>
            </div>
            <div>
              <Link className="view_details" to={`/serviceDetails/${ad.id}`}>
                <i
                  className={`text-sm bi ${
                    i18n.language === "ar" ? "bi-arrow-left" : "bi-arrow-right"
                  }`}
                ></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 🔹 Pagination component
  const renderPagination = () => {
    if (!pagination) return null;

    const { current_page, last_page } = pagination;
    return (
      <nav className="mt-4">
        <ul className="pagination justify-content-center gap-2">
          <li className={`page-item ${current_page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link rounded-3"
              onClick={() => setPage(current_page - 1)}
            >
              <i className={`bi ${i18n.language === "ar" ? "bi-chevron-right" : "bi-chevron-left"}`}></i>
            </button>
          </li>

          {Array.from({ length: last_page }, (_, i) => (
            <li
              key={i + 1}
              className={`page-item ${current_page === i + 1 ? "active" : ""}`}
            >
              <button
                className="page-link rounded-3"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}

          <li
            className={`page-item main-color text-sm ${
              current_page === last_page ? "disabled" : ""
            }`}
          >
            <button
              className="page-link rounded-3"
              onClick={() => setPage(current_page + 1)}
            >
              <i className={`bi ${i18n.language === "ar" ? "bi-chevron-left" : "bi-chevron-right"}`}></i>
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <>
      <Breadcrumb title={t("labels.all_ads")} />

      <div className="recommended_services py-5">
        <div className="container">
          {isDataLoading ? (
            <CardsLoader />
          ) : paginatedAds?.length > 0 ? (
            <>
              <div className="row">
                {paginatedAds.map((ad, index) => renderAdCard(ad, index))}
              </div>
              {renderPagination()}
            </>
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

export default AdsPage;
