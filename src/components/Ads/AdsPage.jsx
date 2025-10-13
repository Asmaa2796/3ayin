import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CardsLoader from "../../pages/CardsLoader";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { fetchAdsWithPagination } from "../../redux/Slices/AdsSlice";
import { searchAds } from "../../redux/Slices/SearchSlice";

const AdsPage = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();

  const { ads, isLoading, pagination } = useSelector((state) => state.ads);
  const { adsList, loadingFiltered, adsPagination } = useSelector(
    (state) => state.search
  );

  const [searchParams] = useSearchParams();
  const searchValue = searchParams.get("search");
  const subCategoryId = searchParams.get("sub_category_id");
  const subSubCategoryId = searchParams.get("sub_sub_category_id");
  const [page, setPage] = useState(1);

  // Fetch ads (backend always returns all ads)
  // ✅ Fetch logic: search mode OR category/subcategory filtering
useEffect(() => {
  if (searchValue) {
    // Search mode — use backend search
    dispatch(searchAds({ search: searchValue, page, per_page: 9 }));
  } else {
    // Normal mode — fetch all ads and filter locally
    dispatch(fetchAdsWithPagination({ page, per_page: 9 }));
  }
}, [dispatch, page, i18n.language, searchValue]);

  // Reset page when filters or search change
  useEffect(() => {
    setPage(1);
  }, [searchValue, subCategoryId, subSubCategoryId]);

  const searchMode = Boolean(searchValue);
  const baseAds = searchMode ? adsList : ads;

  // ✅ Client-side filtering
  const showAds = baseAds?.filter((ad) => {
    if (subSubCategoryId) {
      return String(ad.sub_sub_category_id) === String(subSubCategoryId);
    } else if (subCategoryId) {
      return String(ad.sub_category_id) === String(subCategoryId);
    }
    return true;
  });

  const paginationInfo = searchMode ? adsPagination : pagination;
  const isDataLoading = isLoading || loadingFiltered;

  const renderAdCard = (ad, index) => (
    <div className="col-xl-3 col-lg-3 col-md-4 col-12" key={ad.id || index}>
      <Link
        className="recommended_card border rounded-4 mb-3 overflow-hidden d-block"
        to={`/serviceDetails/${ad.id}`}
      >
        <img
          src={ad?.image || "/placeholder.jpg"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder.jpg";
          }}
          alt="service"
          className="img-fluid mb-3 rounded-4"
        />
        <div className="p-3">
          <p className="line-height mb-1 text-dark">{ad?.ad_name}</p>
          <small className="mb-2 d-block text-dark">
            {ad?.category_name} / {ad?.sub_category_name}{" "}
            {ad?.sub_sub_category_name && `/ ${ad?.sub_sub_category_name}`}
          </small>

          <div className="d-inline-block mb-2 rates">
            {Number(ad?.reviews_count) > 0 ? (
              <>
                {Array.from({ length: 5 }, (_, i) => {
                  const avg = Number(ad?.average_rate) || 0;
                  if (avg >= i + 1) {
                    return <i key={i} className="bi bi-star-fill text-warning"></i>;
                  } else if (avg > i && avg < i + 1) {
                    return <i key={i} className="bi bi-star-half text-warning"></i>;
                  } else {
                    return <i key={i} className="bi bi-star-fill text-secondary"></i>;
                  }
                })}
                <span className="mx-2 text-dark">
                  ({Number(ad?.reviews_count) || 0})
                </span>
              </>
            ) : (
              <>
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="bi bi-star-fill text-secondary"></i>
                ))}
                <span className="mx-2 text-dark">(0)</span>
              </>
            )}
          </div>

          <div className="text-sm d-flex justify-content-between align-items-center">
            <div className="text-dark">
              {t("recommendedServices.startingFrom")}{" "}
              <span className="fw-bold">
                {ad?.price} {t("recommendedServices.currency")}
              </span>
            </div>
            <div>
              <span className="view_details">
                <i
                  className={`text-sm bi ${
                    i18n.language === "ar" ? "bi-arrow-left" : "bi-arrow-right"
                  }`}
                ></i>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  const renderPagination = () => {
    if (!paginationInfo) return null;
    const { current_page, last_page } = paginationInfo;
    return (
      <nav className="mt-4">
        <ul className="pagination justify-content-center gap-2">
          <li className={`page-item ${current_page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link rounded-3"
              onClick={() => setPage(current_page - 1)}
            >
              <i
                className={`bi ${
                  i18n.language === "ar"
                    ? "bi-chevron-right"
                    : "bi-chevron-left"
                }`}
              ></i>
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
              <i
                className={`bi ${
                  i18n.language === "ar"
                    ? "bi-chevron-left"
                    : "bi-chevron-right"
                }`}
              ></i>
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
          ) : showAds?.length > 0 ? (
            <>
              <div className="row">{showAds.map(renderAdCard)}</div>
              {renderPagination()}
            </>
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

export default AdsPage;
