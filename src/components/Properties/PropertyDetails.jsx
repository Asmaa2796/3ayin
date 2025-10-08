import React, { useEffect, useState } from "react";
import "../ServicesPage/ServicesPage.css";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { MdWifiCalling3 } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { data, Link, useParams } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import Ripples from "react-ripples";
import RelatedProperties from "../RelatedProperties/RelatedProperties";
import DetailsLoader from "../../pages/DetailsLoader";
import { fetchPropertyById } from "../../redux/Slices/AddPropertySlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import { FaXTwitter } from "react-icons/fa6";
const PropertyDetails = () => {
  const { t, i18n } = useTranslation("global");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { record: propertyItem, isLoading } = useSelector(
    (state) => state.property
  );
  const [theme, setTheme] = useState(
    () => sessionStorage.getItem("theme") || "light"
  );
  const finishingMap = {
    semi: t("property.finishingSemi"),
    full: t("property.finishingFull"),
    superLux: t("property.finishingSuperLux"),
    company: t("property.finishingCompany"),
  };
  const furnitureMap = {
    empty: t("property.furnitureEmpty"),
    furnished: t("property.furnitureFurnished"),
    semi: t("property.furnitureSemi"),
    none: t("property.furnitureNone"),
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
  const paymentMethodMap = {
    cash: t("property.paymentCash"),
    installments: t("property.paymentInstallments"),
    monthly: t("property.paymentMonthly"),
  };
  useEffect(() => {
    if (!propertyItem?.images?.length) return;

    const carouselElement = document.getElementById("customCarousel");

    const updateThumbnails = () => {
      const activeItem = carouselElement?.querySelector(
        ".carousel-item.active"
      );
      const allItems = Array.from(
        carouselElement?.querySelectorAll(".carousel-item") || []
      );
      const activeIndex = allItems.indexOf(activeItem);

      const thumbnailItems = carouselElement?.querySelectorAll("ul li");
      thumbnailItems?.forEach((li, i) => {
        li.classList.toggle("active", i === activeIndex);
      });
    };

    const handleThumbnailClick = (e) => {
      const li = e.target.closest("li[data-bs-slide-to]");
      if (!li) return;

      const index = Number(li.getAttribute("data-bs-slide-to"));

      const thumbnailItems = carouselElement?.querySelectorAll("ul li");
      thumbnailItems?.forEach((li, i) => {
        li.classList.toggle("active", i === index);
      });
    };

    carouselElement?.addEventListener("slid.bs.carousel", updateThumbnails);

    const thumbnailList = carouselElement?.querySelector("ul");
    thumbnailList?.addEventListener("click", handleThumbnailClick);

    updateThumbnails();

    return () => {
      carouselElement?.removeEventListener(
        "slid.bs.carousel",
        updateThumbnails
      );
      thumbnailList?.removeEventListener("click", handleThumbnailClick);
    };
  }, [propertyItem?.images]);

  //   theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    sessionStorage.setItem("theme", theme);
  }, [theme]);

  // handle rating form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(sessionStorage.getItem("user3ayin"));
    const userID = user?.user?.id;
    const token = user?.token;

    if (!userID || !token) {
      toast.error(t("please_log_in_to_continue"));
      return;
    }

    if (!rating || comment.trim() === "") {
      toast.error(t("servicesPage.provideRate"));
      return;
    }

    const property_id = propertyItem?.id;

    const formData = new FormData();
    formData.append("property_id", property_id);
    formData.append("rate", rating);
    formData.append("comment", comment);
    try {
      const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const res = await axios.post(
        "https://3ayin.resporthub.com/api/rate_property",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Lang: i18n.language,
          },
        }
      );

      if (res?.data?.code === 201) {
        toast.success(t("servicesPage.rateSuccess"));
        setComment("");
        setRating(0);
        setHovered(0);
        dispatch(fetchPropertyById(id));
        getPropertyReview();
      } else {
        toast.error(t("servicesPage.rateFail"));
      }
    } catch (error) {
      if (error.response?.data?.message === "rate_before") {
        toast.error(t("servicesPage.alreadyRated"));
        setComment("");
        setRating(0);
        setHovered(0);
      } else {
        toast.error(t("servicesPage.rateFail"));
        setComment("");
        setRating(0);
        setHovered(0);
      }
      console.error("Rating error:", error);
    }
  };

  useEffect(() => {
    setReviews([]);
    getPropertyReview();
    dispatch(fetchPropertyById(id));
  }, [id, i18n, t]);

  // get ad review
  const getPropertyReview = async () => {
    try {
      // const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const { data } = await axios.get(
        `https://3ayin.resporthub.com/api/property/${id}/reviews`,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
            Lang: i18n.language,
          },
        }
      );
      if (data?.code === 200) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (id) {
      getPropertyReview();
    }
  }, [id]);

  return (
    <>
      <div className="services_details_page bg_overlay">
        <Breadcrumb
          title={t("property.all")}
          pageLink="/all_proprties"
          subTitle={propertyItem?.title}
        />
        <div className="container">
          <div className="services_details_wrapper py-5 position-relative">
            {isLoading ? (
              <DetailsLoader />
            ) : propertyItem ? (
              <div className="row">
                <div className="col-xl-4 col-lg-4 col-md-4 col-12">
                  <div className="carousel_wrapper">
                    <div
                      id="customCarousel"
                      className="carousel slide"
                      data-bs-ride="carousel"
                      data-bs-interval="3000"
                      data-bs-wrap="true"
                      data-bs-pause="false"
                    >
                      {/* Carousel slides */}
                      <div className="carousel-inner">
                        {propertyItem?.images?.length > 0 ? (
                          propertyItem.images.map((img, i) => (
                            <div
                              key={i}
                              className={`carousel-item ${
                                i === 0 ? "active" : ""
                              }`}
                            >
                              <img
                                src={
                                  img?.url?.trim()
                                    ? img.url
                                    : "/placeholder.jpg"
                                }
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "/placeholder.jpg";
                                }}
                                className="d-block w-100"
                                alt={`Slide ${i + 1}`}
                                style={{
                                  maxHeight: "400px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          ))
                        ) : (
                          <div className="carousel-item active">
                            <img
                              src="/placeholder.jpg"
                              className="d-block w-100"
                              alt="Placeholder"
                              style={{ maxHeight: "400px", objectFit: "cover" }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Thumbnails */}
                      <ul
                        data-thumbnails
                        className="d-flex justify-content-center gap-2 mt-3 list-unstyled p-0"
                      >
                        {propertyItem?.images?.length > 0 ? (
                          propertyItem.images.map((img, i) => (
                            <li
                              key={i}
                              data-bs-target="#customCarousel"
                              data-bs-slide-to={i}
                              className={i === 0 ? "active" : ""}
                            >
                              <img
                                src={
                                  img?.url?.trim()
                                    ? img.url
                                    : "/placeholder.jpg"
                                }
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "/placeholder.jpg";
                                }}
                                width="60"
                                height="60"
                                alt={`Thumb ${i + 1}`}
                                style={{
                                  objectFit: "cover",
                                  cursor: "pointer",
                                }}
                              />
                            </li>
                          ))
                        ) : (
                          <li className="active">
                            <img
                              src="/placeholder.jpg"
                              width="60"
                              height="60"
                              alt="Placeholder"
                              style={{ objectFit: "cover", cursor: "pointer" }}
                            />
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-xl-8 col-lg-8 col-md-8 col-12">
                  <div className="details_wrapper px-4 mb-5 position-relative">
                    <h4 className="fw-bold">{propertyItem?.ad_name}</h4>
                    <div className="user_info my-4 d-flex align-items-center">
                      <img
                        src={propertyItem?.user?.image || "/user.webp"}
                        onError={(e) => {
                          e.target.onerror = null; // prevent infinite loop
                          e.target.src = "/user.webp";
                        }}
                        alt="--"
                      />
                      <Link to={`/service_provider/${propertyItem?.user?.id}`}>
                        <span className="mx-2 fw-bold">
                          {propertyItem?.user?.name} {""}
                          <i
                            className={`bi text-sm ${
                              i18n.language === "ar"
                                ? "bi-arrow-left"
                                : "bi-arrow-right"
                            }`}
                          ></i>
                        </span>
                      </Link>
                    </div>
                    {(propertyItem?.availability === "متوفر" ||
                      propertyItem?.availability === "available") && (
                      <small className="available d-inline-block mb-3">
                        {propertyItem?.availability}
                      </small>
                    )}
                    <h4 className="fw-bold">
                      {propertyItem?.price} {t("servicesPage.egp")}
                    </h4>
                    <p className="line-height text-md my-4">
                      {propertyItem?.small_desc}
                    </p>
                    <Link
                      className="contact_with_provider"
                      to={`tel:${
                        propertyItem?.phone
                          ? propertyItem?.phone
                          : propertyItem?.user?.phone
                      }`}
                    >
                      <MdWifiCalling3 />{" "}
                      {t("servicesPage.contactServiceProvider")}
                    </Link>
                    <div className="share d-flex align-items-center my-3">
                      <small className="fw-bold">
                        {t("servicesPage.share")}
                      </small>
                      <div className="d-flex mx-2 gap-2">
                        <FacebookShareButton
                          url={window.location.href}
                          quote={propertyItem?.small_desc}
                          hashtag="#3ayin"
                        >
                          <FacebookIcon size={22} round />
                        </FacebookShareButton>

                        <TwitterShareButton
                          url={window.location.href}
                          title={propertyItem?.ad_name}
                        >
                          <FaXTwitter size={22} className="text-dark" />
                        </TwitterShareButton>

                        <LinkedinShareButton
                          url={window.location.href}
                          title={propertyItem?.ad_name}
                          summary={propertyItem?.small_desc}
                          source="3ayin"
                        >
                          <LinkedinIcon size={22} round />
                        </LinkedinShareButton>

                        <WhatsappShareButton
                          url={window.location.href}
                          title={propertyItem?.ad_name}
                          separator=" - "
                        >
                          <WhatsappIcon size={22} round />
                        </WhatsappShareButton>
                        {navigator.share && (
                          <button
                            className="btn btn-sm btn-outline-dark fw-bold d-flex align-items-center"
                            onClick={() =>
                              navigator.share({
                                title: propertyItem?.ad_name,
                                text: propertyItem?.small_desc,
                                url: window.location.href,
                              })
                            }
                          >
                            <i className="bi bi-share me-1"></i>&nbsp;
                            {t("servicesPage.share_now")}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="vr_map">
                      {propertyItem?.video_url && (
                        <>
                          <Link
                            data-tooltip-id="tooltip1"
                            data-tooltip-content={t("services.clickHere")}
                            className="d-block"
                            target="_blank"
                            rel="noopener noreferrer"
                            to={propertyItem?.video_url}
                          >
                            <img src="/youtube.png" alt="--" />
                            <small className="fw-bold main-color d-block my-2 text-xs text-center">
                              {t("servicesPage.video")}
                            </small>
                          </Link>
                          <Tooltip id="tooltip1" />
                        </>
                      )}
                      {propertyItem?.AR_VR && (
                        <>
                          <Link
                            data-tooltip-id="tooltip3"
                            data-tooltip-content={t("services.clickHere")}
                            className="d-block"
                            target="_blank"
                            rel="noopener noreferrer"
                            to={propertyItem?.AR_VR}
                          >
                            <img src="/vr.png" alt="--" />
                            <small className="fw-bold main-color d-block my-2 text-xs text-center">
                              AR/VR
                            </small>
                          </Link>
                          <Tooltip id="tooltip3" />
                        </>
                      )}
                      {propertyItem?.location && (
                        <img src="/map.png" alt="--" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-xl-12 col-lg-12 xol-md-12 col-12">
                  {/* service info */}
                  <div className="service_info position-relative my-4">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                      <li className="nav-item" role="presentation">
                        <Ripples color="rgba(219, 147, 12, 0.21)" during={1500}>
                          <button
                            className="nav-link active"
                            id="property_status-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#property_status"
                            type="button"
                            role="tab"
                            aria-controls="property_status"
                            aria-selected="true"
                          >
                            {t("property.property_status")}
                          </button>
                        </Ripples>
                      </li>
                      <li className="nav-item" role="presentation">
                        <Ripples color="rgba(219, 147, 12, 0.21)" during={1500}>
                          <button
                            className="nav-link"
                            id="address-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#address"
                            type="button"
                            role="tab"
                            aria-controls="address"
                            aria-selected="true"
                          >
                            {t("property.address")}
                          </button>
                        </Ripples>
                      </li>
                      {propertyItem?.category === "rent" && (
                        <li className="nav-item" role="presentation">
                          <Ripples
                            color="rgba(219, 147, 12, 0.21)"
                            during={1500}
                          >
                            <button
                              className="nav-link"
                              id="ratings-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#ratings"
                              type="button"
                              role="tab"
                              aria-controls="ratings"
                              aria-selected="false"
                            >
                              {t("servicesPage.ratings")}{" "}
                              <span>({reviews?.length || 0})</span>
                            </button>
                          </Ripples>
                        </li>
                      )}
                      <li className="nav-item" role="presentation">
                        <Ripples color="rgba(219, 147, 12, 0.21)" during={1500}>
                          <button
                            className="nav-link"
                            id="extraFiles-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#extraFiles"
                            type="button"
                            role="tab"
                            aria-controls="extraFiles"
                            aria-selected="false"
                          >
                            {t("servicesPage.extraFiles")}
                          </button>
                        </Ripples>
                      </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                      <div
                        className="tab-pane fade show active p-3"
                        id="property_status"
                        role="tabpanel"
                        aria-labelledby="property_status-tab"
                      >
                        <ul className="p-0 list-unstyled mb-0 row">
                          <li className="my-3 text-sm col-xl-4 col-lg-4 col-md-6 col-12">
                            <span className="fw-bold">
                              <i
                                className={`bi bi-caret-${
                                  i18n.language === "ar" ? "left" : "right"
                                }-fill`}
                              ></i>{" "}
                              {t("property.unitCategory")} :{" "}
                            </span>
                            <span className="text-success border bg-white rounded-5 px-3 py-1">
                              {categoryMap[propertyItem.category] ||
                                propertyItem.category}
                            </span>
                          </li>
                          <li className="my-3 text-sm col-xl-4 col-lg-4 col-md-6 col-12">
                            <span className="fw-bold">
                              <i
                                className={`bi bi-caret-${
                                  i18n.language === "ar" ? "left" : "right"
                                }-fill`}
                              ></i>{" "}
                              {t("property.unitType")} :{" "}
                            </span>
                            <span className="text-success border bg-white rounded-5 px-3 py-1">
                              {unitTypeMap[propertyItem.unit_type] ||
                                propertyItem.unit_type}
                            </span>
                          </li>
                          <li className="my-3 text-sm col-xl-4 col-lg-4 col-md-6 col-12">
                            <span className="fw-bold">
                              <i
                                className={`bi bi-caret-${
                                  i18n.language === "ar" ? "left" : "right"
                                }-fill`}
                              ></i>{" "}
                              {t("property.finishingStatus")} :{" "}
                            </span>
                            <span className="text-success border bg-white rounded-5 px-3 py-1">
                              {finishingMap[propertyItem.finishing_status] ||
                                propertyItem.finishing_status}
                            </span>
                          </li>
                          <li className="my-3 text-sm col-xl-4 col-lg-4 col-md-6 col-12">
                            <span className="fw-bold">
                              <i
                                className={`bi bi-caret-${
                                  i18n.language === "ar" ? "left" : "right"
                                }-fill`}
                              ></i>{" "}
                              {t("property.furnitureStatus")} :{" "}
                            </span>
                            <span className="text-success border bg-white rounded-5 px-3 py-1">
                              {furnitureMap[propertyItem.furniture_status] ||
                                propertyItem.furniture_status}
                            </span>
                          </li>
                          <li className="my-3 text-sm col-xl-4 col-lg-4 col-md-6 col-12">
                            <span className="fw-bold">
                              <i
                                className={`bi bi-caret-${
                                  i18n.language === "ar" ? "left" : "right"
                                }-fill`}
                              ></i>{" "}
                              {t("property.paymentMethod")} :{" "}
                            </span>
                            <span className="text-success border bg-white rounded-5 px-3 py-1">
                              {paymentMethodMap[propertyItem.payment_method] ||
                                propertyItem.payment_method}
                            </span>
                          </li>
                          <li className="my-3 text-sm col-xl-4 col-lg-4 col-md-6 col-12">
                            <span className="fw-bold">
                              <i
                                className={`bi bi-caret-${
                                  i18n.language === "ar" ? "left" : "right"
                                }-fill`}
                              ></i>{" "}
                              {t("property.deposit")} :{" "}
                            </span>
                            <span className="text-success border bg-white rounded-5 px-3 py-1">
                              {propertyItem.deposit_amount}
                            </span>
                          </li>
                      
                          <li className="my-3 text-sm col-xl-4 col-lg-4 col-md-6 col-12">
                            <span className="fw-bold">
                              <i
                                className={`bi bi-caret-${
                                  i18n.language === "ar" ? "left" : "right"
                                }-fill`}
                              ></i>{" "}
                              {t("property.area")} :{" "}
                            </span>
                            <span className="text-success border bg-white rounded-5 px-3 py-1">
                              {propertyItem.area_sqm}
                            </span>
                          </li>
                          <li className="my-3 text-sm col-xl-4 col-lg-4 col-md-6 col-12">
                            <span className="fw-bold">
                              <i
                                className={`bi bi-caret-${
                                  i18n.language === "ar" ? "left" : "right"
                                }-fill`}
                              ></i>{" "}
                              {t("property.rooms")} :{" "}
                            </span>
                            <span className="text-success border bg-white rounded-5 px-3 py-1">
                              {propertyItem.rooms}
                            </span>
                          </li>
                          <li className="my-3 text-sm col-xl-4 col-lg-4 col-md-6 col-12">
                            <span className="fw-bold">
                              <i
                                className={`bi bi-caret-${
                                  i18n.language === "ar" ? "left" : "right"
                                }-fill`}
                              ></i>{" "}
                              {t("property.floor")} :{" "}
                            </span>
                            <span className="text-success border bg-white rounded-5 px-3 py-1">
                              {propertyItem.floor}
                            </span>
                          </li>
                            </ul>
                      </div>
                      <div
                        className="tab-pane fade p-3"
                        id="address"
                        role="tabpanel"
                        aria-labelledby="address-tab"
                      >
                        <b className="d-block text-sm">
                          <i
                            className={`bi bi-caret-${
                              i18n.language === "ar" ? "left" : "right"
                            }-fill`}
                          ></i>{" "}
                          {t("property.detailedAddress")}
                        </b>
                        <p className="line-height text-sm my-2">
                          {propertyItem.address_details}
                        </p>
                        <ul className="p-0 list-unstyled mb-0">
                          <li className="my-3 text-sm col-xl-4 col-lg-4 col-md-6 col-12">
                            <span className="fw-bold">
                              <i
                                className={`bi bi-caret-${
                                  i18n.language === "ar" ? "left" : "right"
                                }-fill`}
                              ></i>{" "}
                              {t("create_ad.location")} :{" "}
                            </span>
                            <span className="text-success border bg-white rounded-5 px-3 py-1 d-block my-2">
                              {propertyItem.location}
                            </span>
                          </li>
                        </ul>
                        <div className="border rounded-3 p-2 shadow-sm bg-white">
                          {propertyItem?.latitude &&
                            propertyItem?.longitude ? (
                              <iframe
                                title="property-map"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                src={`https://www.google.com/maps?q=${propertyItem.latitude},${propertyItem.longitude}&hl=${i18n.language}&z=15&output=embed`}
                                allowFullScreen
                              ></iframe>
                            ):(<img className="w-100" style={{height:"180px"}} src="/map-location.svg"/>)}
                        </div>
                      </div>
                      {propertyItem?.category === "rent" && (
                        <div
                          className="tab-pane fade p-3"
                          id="ratings"
                          role="tabpanel"
                          aria-labelledby="ratings-tab"
                        >
                          {reviews.length > 0 ? (
                            reviews.map((review) => (
                              <div
                                key={review.id}
                                className="rate_wrapper mb-2"
                              >
                                <div className="row">
                                  {/* User Image */}
                                  <div className="col-xl-2 col-lg-2 col-md-2 col-12">
                                    <img
                                      src={review.user?.image || "/user.webp"}
                                      alt={review.user?.name || "User"}
                                      className="d-block my-2"
                                      style={{
                                        borderRadius: "50%",
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "cover",
                                      }}
                                      onError={(e) =>
                                        (e.target.src = "/user.webp")
                                      }
                                    />
                                  </div>

                                  {/* User Info */}
                                  <div className="col-xl-7 col-lg-7 col-md-7 col-12">
                                    <b>{review.user?.name}</b>
                                    <p>{review.created_at}</p>
                                    <p
                                      className={`line-height ${
                                        i18n.language === "en"
                                          ? "custom-font"
                                          : ""
                                      }`}
                                    >
                                      {review.comment}
                                    </p>
                                  </div>

                                  {/* Rating */}
                                  <div className="col-xl-3 col-lg-3 col-md-3 col-12">
                                    <div className="mb-1 text-center">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <i
                                          key={star}
                                          className={`bi ${
                                            star <= parseInt(review.rate)
                                              ? "bi-star-fill text-warning"
                                              : "bi-star text-secondary"
                                          }`}
                                        ></i>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-center text-sm my-3">
                              <div className="main-color">
                                <i className="bi bi-star"></i>
                                <i className="bi bi-star-half"></i>
                                <i className="bi bi-star-half"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                              </div>
                              <span className="d-block">
                                {t("no_reviews_yet")}
                              </span>
                            </div>
                          )}

                          {reviews.length > 3 && (
                            <div className="text-center">
                              <Link className="show_more">
                                {t("recommendedServices.showMore")}{" "}
                                <i
                                  className={`bi ${
                                    i18n.language === "ar"
                                      ? "bi-arrow-left"
                                      : "bi-arrow-right"
                                  }`}
                                ></i>
                              </Link>
                            </div>
                          )}
                          <form
                            onSubmit={handleSubmit}
                            className="rating-form my-3"
                          >
                            <div className="mt-5 mb-4 d-flex align-items-center">
                              <label className="d-block mb-0 fw-bold">
                                {t("servicesPage.rating")}
                              </label>
                              <div className="mx-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <i
                                    key={star}
                                    className={`bi ${
                                      star <= (hovered || rating)
                                        ? "bi-star-fill"
                                        : "bi-star"
                                    } text-warning fs-4 me-1 cursor-pointer`}
                                    onMouseEnter={() => setHovered(star)}
                                    onMouseLeave={() => setHovered(0)}
                                    onClick={() => setRating(star)}
                                    style={{ cursor: "pointer" }}
                                  />
                                ))}
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="comment"
                                className="d-block fw-bold"
                              >
                                {t("servicesPage.writeReview")}
                              </label>
                              <textarea
                                id="comment"
                                rows="4"
                                value={comment}
                                placeholder={t("servicesPage.writeComment")}
                                onChange={(e) => setComment(e.target.value)}
                              ></textarea>
                            </div>

                            <button type="submit" className="fw-bold border-0 ">
                              {t("servicesPage.submit")}{" "}
                              <i
                                className={`text-sm bi ${
                                  i18n.language === "ar"
                                    ? "bi-arrow-left"
                                    : "bi-arrow-right"
                                }`}
                              ></i>
                            </button>
                          </form>
                        </div>
                      )}
                      <div
                        className="tab-pane fade p-3"
                        id="extraFiles"
                        role="tabpanel"
                        aria-labelledby="extraFiles-tab"
                      >
                        {propertyItem?.files &&
                        propertyItem.files.length > 0 ? (
                          propertyItem.files.map((file, index) => {
                            const isPdf = file.file
                              ?.toLowerCase()
                              .endsWith(".pdf");
                            const fileIcon = isPdf ? "/pdf.png" : "/doc.png";

                            return (
                              <div key={index} className="file_wrapper mb-3">
                                <div className="row">
                                  <div className="col-xl-2 col-lg-2 col-md-2 col-12">
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <img
                                        src={fileIcon}
                                        alt={file.id}
                                        className="d-block my-2"
                                      />
                                    </a>
                                  </div>
                                  <div className="col-xl-10 col-lg-10 col-md-10 col-12">
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-decoration-none"
                                    >
                                      {file.name || "File"}
                                    </a>

                                    <p>{t("fileUploadDateNotAvailable")}</p>
                                    <span className="d-block text-success fw-bold">
                                      {`${(file.size / 1024).toFixed(1)} ${
                                        i18n.language === "en"
                                          ? "MB"
                                          : "ميجا بايت"
                                      }`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="no_data bg-white py-5 border rounded-2 my-3 text-center">
                            <h5 className="mb-0">{t("no_data_exists")}</h5>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-12 col-lg-12 xol-md-12 col-12 position-relative">
                  <RelatedProperties propertyID={propertyItem?.id} />
                </div>
              </div>
            ) : (
              <div className="no_data bg-white py-5 border rounded-2 my-3 text-center">
                <h5 className="mb-0">{t("no_data_exists")}</h5>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default PropertyDetails;
