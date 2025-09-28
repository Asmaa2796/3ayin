import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CardsLoader from "../../pages/CardsLoader";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { fetchAllProperties } from "../../redux/Slices/AllPropertiesSlice";

const PropertiesPage = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();

  const { properties, isLoading } = useSelector((state) => state.properties);
    useEffect(() => {
        dispatch(fetchAllProperties());
    }, [dispatch,i18n.language]);
    console.log(properties);
    const categoryMap = {
    sale: t("property.sale"),
    rent: t("property.rent"),
    share: t("property.share"),
  };
  const unitTypeMap = {
    apartment: t("property.apartment"),
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
      <Breadcrumb title={t("property.all")} />

      <div className="recommended_services py-5">
        <div className="container">
          {isLoading ? (
            <CardsLoader />
          ) : properties?.length > 0 ? (
            <>
              <div className="row">
                {properties.map((item, index) => (
                  <div
                    className="col-xl-3 col-lg-3 col-md-6 col-12"
                    key={item.id || index}
                  >
                    <div className="recommended_card border rounded-4 overflow-hidden">
                      <img
                        src={item.images?.[0]?.image || "/image.jpg"}
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
