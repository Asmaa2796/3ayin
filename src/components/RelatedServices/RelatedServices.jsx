import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../RecommendedServices/RecommendedServices.css";
import { Link } from "react-router-dom";
import axios from "axios";
const RelatedServices = ({ adCategory, currentAdId }) => {
  const { t, i18n } = useTranslation("global");
  const swiperKey = useMemo(() => `swiper-${i18n.language}`, [i18n.language]);
  const isRTL = i18n.language === "ar";

  const [relatedAds, setRelatedAds] = useState([]);

  useEffect(() => {
    if (!adCategory) return;

    const fetchRelated = async () => {
      try {
        const response = await axios.get(
          `https://app.xn--mgb9a0bp.com/api/ads/by-category/${adCategory}`,
          {
            headers: {
              Lang: i18n.language,
            },
          }
        );

        const allAds = response.data?.data || [];

        const filteredAds = allAds.filter((ad) => ad.id !== currentAdId);

        setRelatedAds(filteredAds);
      } catch (err) {
      }
    };

    fetchRelated();
  }, [adCategory, i18n, t]);

  return (
    <div className="recommended_services py-5">
      <div className="container-fluid">
        <h3 className="mb-4 text-center fw-bold main-color d-flex align-items-center justify-content-between">
          <span>{t("servicesPage.relatedServices")}</span>
          <Link className="add2" to="/publish_ad">
            <i className="bi bi-plus"></i> {t("navbar.add")}
          </Link>
        </h3>
        {relatedAds && relatedAds.length >= 1 ? (
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
            {relatedAds.map((ad, index) => (
              <SwiperSlide key={ad.id || index}>
                <Link to={`/serviceDetails/${ad.id}`} className="recommended_card border rounded-4 overflow-hidden d-block">
                  <img
                    src={ad?.image?.trim() ? ad.image : "/placeholder.jpg"}
                    onError={(e) => {
                      e.currentTarget.onerror = null; // prevent infinite loop
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                    alt="--"
                    className="img-fluid mb-3 rounded-4"
                  />
                  <div className="p-3">
                    <p className="line-height mb-1 text-dark">{ad?.small_desc}</p>
                    <small className="mb-2 d-block text-dark">
                      {ad?.category_name} / {ad?.sub_category_name}
                    </small>
                    <div className="d-inline-block mb-2 rates">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`bi bi-star-fill ${
                            i < Math.round(ad?.average_rate || 0)
                              ? "text-warning"
                              : "text-secondary"
                          }`}
                        ></i>
                      ))}
                      <span className="mx-2 text-dark">({ad?.reviews_count || 0})</span>
                    </div>

                    <div className="text-sm d-flex justify-content-between align-items-center">
                      <div className="text-dark">
                        {t("recommendedServices.startingFrom")}
                        <span className="fw-bold">
                          {ad?.price} {t("recommendedServices.currency")}
                        </span>
                      </div>
                      <div>
                        <Link
                          className="view_details"
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

export default RelatedServices;
