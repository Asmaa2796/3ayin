import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CardsLoader from "../../pages/CardsLoader";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { fetchAllProperties } from "../../redux/Slices/AllPropertiesSlice";
import { searchProperty } from "../../redux/Slices/SearchSlice";
import { fetchPurposes, fetchTypes, fetchPropertCategories } from "../../redux/Slices/PropertyApisSlice";

const PropertiesPage = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const [activeType, setActiveType] = useState("all");
  const [filters, setFilters] = useState({
    purpose_id: null,
    category_id: null,
    property_type_id: null,
  });
  const [page, setPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get("search");

  const { properties, isLoading, pagination } = useSelector(
    (state) => state.properties
  );
  const { purposes, types, property_categories } = useSelector(
    (state) => state.properties_api
  );
  const { propertiesList, loadingFiltered, propertiesPagination } = useSelector(
    (state) => state.search
  );
  useEffect(() => {
    setPage(1);
  }, [searchValue]);
  useEffect(() => {
    if (searchValue) {
      dispatch(searchProperty({ search: searchValue, page, per_page: 9 }));
    } else {
      dispatch(fetchAllProperties({ filters, page, per_page: 9 }));
    }
  }, [dispatch, i18n.language, page, searchValue, filters]);


  useEffect(() => {
    dispatch(fetchPurposes());
    dispatch(fetchTypes());
    dispatch(fetchPropertCategories());
  }, [dispatch, i18n.language]);
  const searchMode = Boolean(searchValue);
  const listToRender = searchMode ? propertiesList : properties;
  const paginationInfo = searchMode ? propertiesPagination : pagination;

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
        <div className="tab_status">
          <button
            className={activeType === "all" ? "active" : ""}
            onClick={() => {
              setActiveType("all");
              setFilters({ purpose_id: null, category_id: null, property_type_id: null });
              setPage(1);
              if (searchValue) {
                window.history.replaceState({}, "", window.location.pathname);
                setSearchParams({});
              }
            }}
          >
            {t("property.all")}
          </button>

          {purposes.map((purpose) => (
            <button
              key={purpose?.id}
              className={activeType === purpose?.name ? "active" : ""}
              onClick={() => {
                setActiveType(purpose?.name);
                setFilters((prev) => ({ ...prev, purpose_id: purpose?.id }));
                setPage(1);
                if (searchValue) {
                  window.history.replaceState({}, "", window.location.pathname);
                  setSearchParams({});
                }
              }}

            >
              {purpose?.name}
            </button>
          ))}
        </div>
        <div className="filters row mt-3 form-style">
          <div className="col-xl-4 col-lg-4 col-md-6 col-12">
            <label className="my-2 d-block">{t("property.category")}</label>
            <select
              value={filters.category_id || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category_id: e.target.value || null }))
              }
            >
              <option value="" className="text-sm" >{t("property.all")}</option>
              {property_categories.map((cat) => (
                <option className="text-sm" key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-xl-4 col-lg-4 col-md-6 col-12">
            <label className="my-2 d-block">{t("property.type")}</label>
            <select
              value={filters.property_type_id || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  property_type_id: e.target.value || null,
                }))
              }
            >
              <option value="" className="text-sm" >{t("property.all")}</option>
              {types.map((type) => (
                <option className="text-sm" key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>
      <div className="recommended_services py-5">
        <div className="container">
          {isLoading || loadingFiltered ? (
            <CardsLoader />
          ) : listToRender?.length > 0 ? (
            <>
              <div className="row">
                {listToRender.map((item, index) => (
                  <div
                    className="col-xl-3 col-lg-3 col-md-6 col-12"
                    key={item.id || index}
                  >
                    <Link
                      to={`/propertyDetails/${item.id}`}
                      className="recommended_card border rounded-4 my-2 overflow-hidden position-relative d-block"
                    >
                      <div className="finishing_status">
                        {finishingMap[item?.finishing_status] || t("labels.undefined")}
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
                          {item?.title && `${item.title.slice(0, 60)} ...`}
                        </p>
                        <hr className="my-1" />
                        <ul className="p-0 mb-0 list-unstyled">
                          <li className="text-sm bg-blue text-white d-block text-center rounded-5 px-2 py-1 my-1 mx-3">
                            <small>{t("property.unitCategory")}</small> :{" "}
                            <small>
                              {item?.purpose?.name ? item?.purpose?.name : t("labels.undefined")}
                            </small>
                          </li>
                          <li className="text-sm bg-success text-white d-block text-center rounded-5 px-2 py-1 my-1 mx-3">
                            <small>{t("property.type")}</small> :{" "}
                            <small>
                              {item?.property_type ? item?.property_type : t("labels.undefined")}
                            </small>
                          </li>
                        </ul>
                        <hr className="my-1" />

                        <div className="text-sm d-flex justify-content-between align-items-center">
                          <div className="text-dark">
                            {t("recommendedServices.startingFrom")}{" "}
                            <span className="fw-bold">
                              {item.price ? `${item?.price} ${t("recommendedServices.currency")}` : t("labels.undefined")}
                            </span>
                          </div>
                          <div>
                            <span className="view_details">
                              <i
                                className={`text-sm bi ${i18n.language === "ar"
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

              {paginationInfo && (
                <div className="d-flex justify-content-center mt-4 align-items-center">
                  <button
                    className="btn btn-outline-primary mx-1"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                  >
                    {t("labels.previous")}
                  </button>

                  <span className="mx-2">
                    {t("labels.page")} {paginationInfo.current_page}{" "}
                    {t("labels.of")} {paginationInfo.last_page}
                  </span>

                  <button
                    className="btn btn-outline-primary mx-1"
                    disabled={page === paginationInfo.last_page}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    {t("labels.next")}
                  </button>
                </div>
              )}
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

export default PropertiesPage;
