import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../RecommendedServices/RecommendedServices.css";
import { Link } from "react-router-dom";
import axios from "axios";
const RelatedProperties = ({ propertyID }) => {
  const { t, i18n } = useTranslation("global");
  const swiperKey = useMemo(() => `swiper-${i18n.language}`, [i18n.language]);
  const isRTL = i18n.language === "ar";

  const [relatedProperties, setRelatedProperties] = useState([]);

  const finishingMap = {
    semi: t("property.finishingSemi"),
    full: t("property.finishingFull"),
    superLux: t("property.finishingSuperLux"),
    company: t("property.finishingCompany"),
  };
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
  useEffect(() => {
    if (!propertyID) return;

    const fetchRelated = async () => {
      try {
        const response = await axios.get(
          `https://3ayin.resporthub.com/api/properties/${propertyID}/related`,
          {
            headers: {
              Lang: i18n.language,
            },
          }
        );

        const allRelatedProperties = response.data?.data || [];
        setRelatedProperties(allRelatedProperties);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRelated();
  }, [propertyID, i18n, t]);

  return (
    <div className="recommended_services py-5">
      <div className="container-fluid">
        <h3 className="mb-4 text-center fw-bold main-color d-flex align-items-center justify-content-between">
          <span>{t("property.relatedProperties")}</span>
          <Link className="add2" to="/add_property">
            <i className="bi bi-plus"></i> {t("navbar.add")}
          </Link>
        </h3>
        {relatedProperties && relatedProperties.length > 0 ? (
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
            {relatedProperties.map((property, index) => (
              <SwiperSlide key={property.id || index}>
                <Link to={`/propertyDetails/${property.id}`} className="recommended_card border rounded-4 my-2 overflow-hidden position-relative d-block">
                  <img
                    src={property.image|| "/image.jpg"}
                    alt={property.title}
                    className="img-fluid mb-3 rounded-4"
                  />
                  <div className="p-3">
                    <p className="line-height mb-1 text-dark">
                      {property.title?.slice(0, 60)}...
                    </p>
                    <ul className="p-0 mb-0 list-unstyled">
                      <li className="text-sm bg-blue text-white d-block text-center rounded-5 px-2 py-1 my-1 mx-3">
                        <small>{t("property.unitCategory")}</small> :{" "}
                        <small>
                          {categoryMap[property?.category] || property?.category}
                        </small>
                      </li>
                      <li className="text-sm bg-success text-white d-block text-center rounded-5 px-2 py-1 my-1 mx-3">
                        <small>{t("property.unitType")}</small> :{" "}
                        <small>
                          {unitTypeMap[property?.unit_type] || property?.unit_type}
                        </small>
                      </li>
                    </ul>
                     <hr className="my-2" />
                    <div className="d-inline-block my-2 rates">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`bi bi-star-fill ${
                            i < Math.round(property?.average_rate || 0)
                              ? "text-warning"
                              : "text-secondary"
                          }`}
                        ></i>
                      ))}
                      <span className="mx-2 text-dark">({property?.reviews_count || 0})</span>
                    </div>

                    <div className="text-sm d-flex justify-content-between align-items-center">
                      <div className="text-dark">
                        {t("recommendedServices.startingFrom")}{" "}
                        <span className="fw-bold">
                          {property.price} {t("recommendedServices.currency")}
                        </span>
                      </div>
                      <div>
                        <span
                          className="view_details"
                        >
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
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="no_data bg-white py-4 border rounded-2 my-3 text-center">
            <h5 className="mb-0 text-md">{t("no_data_exists")}</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedProperties;