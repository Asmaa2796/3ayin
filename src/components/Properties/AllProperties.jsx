import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CardsLoader from "../../pages/CardsLoader";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { fetchAllProperties } from "../../redux/Slices/AllPropertiesSlice";
import { searchProperty } from "../../redux/Slices/SearchSlice";

const PropertiesPage = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const [searchParams] = useSearchParams();
  const searchValue = searchParams.get("search");

  const { properties, isLoading, pagination } = useSelector(
    (state) => state.properties
  );
  const { propertiesList,loadingFiltered } = useSelector((state) => state.search);

  useEffect(() => {
    if (searchValue) {
      dispatch(searchProperty(searchValue));
    } else {
      dispatch(fetchAllProperties({ page, per_page: 9 }));
    }
  }, [dispatch, i18n.language, page, searchValue]);

  const listToRender = searchValue ? propertiesList : properties;

  const startIndex = (page - 1) * 9;
  const paginatedList = searchValue
    ? listToRender?.slice(startIndex, startIndex + 9)
    : listToRender;

  const paginationInfo = searchValue
    ? {
        current_page: page,
        last_page: Math.ceil((listToRender?.length || 0) / 9),
      }
    : pagination;

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
  const finishingMap = {
    semi: t("property.finishingSemi"),
    full: t("property.finishingFull"),
    superLux: t("property.finishingSuperLux"),
    company: t("property.finishingCompany"),
  };

  return (
    <>
      <Breadcrumb title={t("property.all")} />

      <div className="recommended_services py-5">
        <div className="container">
          {(isLoading || loadingFiltered) ? (
            <CardsLoader />
          ) : paginatedList?.length > 0 ? (
            <>
              <div className="row">
                {paginatedList.map((item, index) => (
                  <div
                    className="col-xl-3 col-lg-3 col-md-6 col-12"
                    key={item.id || index}
                  >
                    <div className="recommended_card border rounded-4 my-2 overflow-hidden position-relative">
                      <div className="finishing_status">
                        {finishingMap[item?.finishing_status] ||
                          item?.finishing_status}
                      </div>
                      <img
                        src={item.images?.[0]?.url || "/image.jpg"}
                        alt={item.title}
                        className="img-fluid mb-3 rounded-4"
                      />
                      <div className="p-3">
                        <p className="line-height mb-1">
                          {item.title?.slice(0, 60)}...
                        </p>
                        <hr className="my-1" />
                        <ul className="p-0 mb-0 list-unstyled">
                          <li className="text-sm bg-success text-white d-inline-block rounded-5 px-2 py-1 m-1">
                            <small>{t("property.unitCategory")}</small> :{" "}
                            <small>
                              {categoryMap[item?.category] || item?.category}
                            </small>
                          </li>
                          <li className="text-sm bg-success text-white d-inline-block rounded-5 px-2 py-1 m-1">
                            <small>{t("property.unitType")}</small> :{" "}
                            <small>
                              {unitTypeMap[item?.unit_type] || item?.unit_type}
                            </small>
                          </li>
                        </ul>
                        <hr className="my-1" />

                        <div className="text-sm d-flex justify-content-between align-items-center">
                          <div>
                            {t("recommendedServices.startingFrom")}{" "}
                            <span className="fw-bold">
                              {item.price} {t("recommendedServices.currency")}
                            </span>
                          </div>
                          <div>
                            <Link
                              className="view_details"
                              to={`/propertyDetails/${item.id}`}
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
              <h5 className="mb-0">{t("no_data_exists")}</h5>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PropertiesPage;
