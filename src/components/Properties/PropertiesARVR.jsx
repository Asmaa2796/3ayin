import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CardsLoader from "../../pages/CardsLoader";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { fetchAllProperties } from "../../redux/Slices/AllPropertiesSlice";
import { searchProperty } from "../../redux/Slices/SearchSlice";

const PropertiesARVRPage = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const [activeType, setActiveType] = useState("all");
  const [page, setPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get("search");

  const { properties, isLoading, pagination } = useSelector(
    (state) => state.properties
  );
  const { propertiesList, loadingFiltered, propertiesPagination } = useSelector(
    (state) => state.search
  );

  useEffect(() => {
    if (searchValue) {
      dispatch(searchProperty({ search: searchValue, page, per_page: 9 }));
    } else {
      dispatch(fetchAllProperties({ page, per_page: 9 }));
    }
  }, [dispatch, i18n.language, page, searchValue]);

  const searchMode = Boolean(searchValue);
  const listToRender = searchMode ? propertiesList : properties;
  const paginationInfo = searchMode ? propertiesPagination : pagination;

  const arVrList = (listToRender || []).filter((item) => item?.AR_VR);
  
  const manualPerPage = 4;
  const totalPages = Math.ceil(arVrList.length / manualPerPage);
  const startIndex = (page - 1) * manualPerPage;
  const currentArVrItems = arVrList.slice(startIndex, startIndex + manualPerPage);

  const filteredList = activeType === "ar_vr" ? currentArVrItems : listToRender;

  const finishingMap = {
    semi: t("property.finishingSemi"),
    full: t("property.finishingFull"),
    superLux: t("property.finishingSuperLux"),
    company: t("property.finishingCompany"),
  };

  return (
    <>
      <Breadcrumb title={t("property.all")} />

      <div className="container">
        {/* Filter buttons */}
        <div className="tab_status text-center mb-3">
          <button
            className={activeType === "all" ? "active" : ""}
            onClick={() => {
              setActiveType("all");
              setPage(1);
              if (searchValue) {
                window.history.replaceState({}, "", window.location.pathname);
                setSearchParams({});
              }
            }}
          >
            {t("property.all")}
          </button>

          <button
            className={activeType === "ar_vr" ? "active" : ""}
            onClick={() => {
              setActiveType("ar_vr");
              setPage(1);
              if (searchValue) {
                window.history.replaceState({}, "", window.location.pathname);
                setSearchParams({});
              }
            }}
          >
            AR / VR
          </button>
        </div>
      </div>

      <div className="recommended_services py-5">
        <div className="container">
          {isLoading || loadingFiltered ? (
            <CardsLoader />
          ) : filteredList?.length > 0 ? (
            <>
              <div className="row">
                {filteredList.map((item, index) => (
                  <div
                    className="col-xl-3 col-lg-3 col-md-6 col-12"
                    key={item.id || index}
                  >
                    <Link
                      to={`/propertyDetails/${item.id}`}
                      className="recommended_card border rounded-4 my-2 overflow-hidden position-relative d-block"
                    >
                      <div className="finishing_status">
                        {finishingMap[item?.finishing_status] ||
                          t("labels.undefined")}
                      </div>
                      <img
                        src={item.images?.[0]?.url || "/placeholder.jpg"}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.jpg";
                        }}
                        alt={item.id}
                        className="img-fluid mb-3 rounded-4"
                      />
                      <div className="p-3">
                        <p className="line-height mb-1 text-dark">
                          {item?.title?.slice(0, 60)} ...
                        </p>
                        <hr className="my-1" />
                        <ul className="p-0 mb-0 list-unstyled">
                          <li className="text-sm bg-blue text-white d-block text-center rounded-5 px-2 py-1 my-1 mx-3">
                            <small>{t("property.unitCategory")}</small> :{" "}
                            <small>
                              {item?.purpose?.name
                                ? item.purpose.name
                                : t("labels.undefined")}
                            </small>
                          </li>
                          <li className="text-sm bg-success text-white d-block text-center rounded-5 px-2 py-1 my-1 mx-3">
                            <small>{t("property.type")}</small> :{" "}
                            <small>
                              {item?.property_type || t("labels.undefined")}
                            </small>
                          </li>
                        </ul>
                        <hr className="my-1" />

                        <div className="text-sm d-flex justify-content-between align-items-center">
                          <div className="text-dark">
                            {t("recommendedServices.startingFrom")}{" "}
                            <span className="fw-bold">
                              {item.price
                                ? `${item.price} ${t(
                                    "recommendedServices.currency"
                                  )}`
                                : t("labels.undefined")}
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

              {/* Pagination */}
              <div className="d-flex justify-content-center mt-4 align-items-center">
                {activeType === "all" ? (
                  <>
                    <button
                      className="btn btn-outline-primary mx-1"
                      disabled={page === 1}
                      onClick={() => setPage((prev) => prev - 1)}
                    >
                      {t("labels.previous")}
                    </button>

                    <span className="mx-2">
                      {t("labels.page")} {paginationInfo?.current_page || 1}{" "}
                      {t("labels.of")} {paginationInfo?.last_page || 1}
                    </span>

                    <button
                      className="btn btn-outline-primary mx-1"
                      disabled={page === paginationInfo?.last_page}
                      onClick={() => setPage((prev) => prev + 1)}
                    >
                      {t("labels.next")}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-outline-primary mx-1"
                      disabled={page === 1}
                      onClick={() => setPage((prev) => prev - 1)}
                    >
                      {t("labels.previous")}
                    </button>

                    <span className="mx-2">
                      {t("labels.page")} {page} {t("labels.of")} {totalPages}
                    </span>

                    <button
                      className="btn btn-outline-primary mx-1"
                      disabled={page === totalPages}
                      onClick={() => setPage((prev) => prev + 1)}
                    >
                      {t("labels.next")}
                    </button>
                  </>
                )}
              </div>
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

export default PropertiesARVRPage;
