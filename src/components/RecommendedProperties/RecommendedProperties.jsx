import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./RecommendedServices.css";
import { Link } from "react-router-dom";
import { fetchAllProperties } from "../../redux/Slices/AllPropertiesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import CardsLoader from "../../pages/CardsLoader";
const RecommendedProperties = () => {
  const { t, i18n } = useTranslation("global");
  const swiperKey = useMemo(() => `swiper-${i18n.language}`, [i18n.language]);
  const isRTL = i18n.language === "ar";
  const dispatch = useDispatch();
  const { properties, isLoading } = useSelector((state) => state.properties);
  const cards = properties?.slice(0, 8) || [];
  useEffect(() => {
    dispatch(fetchAllProperties());
  }, [dispatch]);
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
    <div className="recommended_services py-5">
      <div className="container-fluid">
        <h3 className="mb-4 text-center fw-bold main-color">
          {t("property.title")}
        </h3>
        {isLoading ? (
          <CardsLoader />
        ) : cards.length > 0 ? (
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            navigation
            loop={true}
            key={swiperKey}
            dir={isRTL ? "rtl" : "ltr"}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              576: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              992: {
                slidesPerView: 4,
              },
            }}
          >
            {cards.map((item, index) => (
              <SwiperSlide key={item.id || index}>
                <div
                  key={item.id || index}
                  className="recommended_card border rounded-4 my-2 overflow-hidden position-relative"
                >
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
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="no_data bg-white py-5 border rounded-2 my-3 text-center">
            <h5 className="mb-0">{t("no_data_exists")}</h5>
          </div>
        )}
        {cards.length > 0 && (
          <div className="text-center">
            <Link className="show_more" to="/all_properties">
              {t("recommendedServices.showMore")}{" "}
              <i
                className={`bi ${
                  i18n.language === "ar" ? "bi-arrow-left" : "bi-arrow-right"
                }`}
              ></i>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedProperties;
