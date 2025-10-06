import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./RecommendedServices.css";
import { Link } from "react-router-dom";
import { fetchAds } from "../../redux/Slices/AdsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import CardsLoader from "../../pages/CardsLoader";
const RecommendedServices = () => {
  const { t, i18n } = useTranslation("global");
  const swiperKey = useMemo(() => `swiper-${i18n.language}`, [i18n.language]);
  const isRTL = i18n.language === "ar";
  const dispatch = useDispatch();
  const { ads, isLoading } = useSelector((state) => state.ads);
  const cards = ads?.slice(0, 8) || [];
  useEffect(() => {
    dispatch(fetchAds());
  }, [dispatch]);
  const averageRating = (reviews = []) => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + parseInt(r.rate), 0);
    return Math.round(total / reviews.length);
  };
  return (
    <div className="recommended_services py-5">
      <div className="container-fluid">
        <h3 className="mb-4 text-center fw-bold main-color">
          {t("recommendedServices.title")}
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
                <Link
                  to={`/serviceDetails/${item.id}`}
                  className="recommended_card border d-block rounded-4 my-2 overflow-hidden"
                >
                  <img
                    src={item.images?.[0]?.image || "/placeholder.jpg"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.jpg";
                    }}
                    alt={item.ad_name}
                    className="img-fluid mb-3 rounded-4"
                  />
                  <div className="p-3">
                    <p className="line-height mb-1 text-dark">
                      {item.ad_name?.slice(0, 60)}...
                    </p>
                    <small className="mb-2 d-block text-dark">
                      {item?.category_name} / {item?.sub_category_name}
                    </small>
                    <div className="d-inline-block mb-2 rates">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <i
                          key={i}
                          className={`bi bi-star-fill ${
                            i <= averageRating(item.reviews)
                              ? "text-warning"
                              : "text-secondary"
                          }`}
                        ></i>
                      ))}
                      <span className="mx-2 text-dark">
                        ({item.reviews?.length || 0})
                      </span>
                    </div>
                    <div className="text-sm d-flex justify-content-between align-items-center">
                      <div className="text-dark">
                        {t("recommendedServices.startingFrom")}{" "}
                        <span className="fw-bold">
                          {item.price} {t("recommendedServices.currency")}
                        </span>
                      </div>
                      <div>
                        <span className="view_details">
                          <i
                            className={`text-sm bi ${
                              isRTL ? "bi-arrow-left" : "bi-arrow-right"
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
          <div className="no_data bg-white py-5 border rounded-2 my-3 text-center">
            <h5 className="mb-0">{t("no_data_exists")}</h5>
          </div>
        )}
        {cards.length > 0 && (
          <div className="text-center">
            <Link className="show_more" to="/all_ads">
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

export default RecommendedServices;
