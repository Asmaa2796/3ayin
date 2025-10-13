import React, { useEffect, useState } from "react";
import "./ServicesPage.css";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { MdWifiCalling3 } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { data, Link, useParams } from "react-router-dom";
import Ripples from "react-ripples";
import RelatedServices from "../RelatedServices/RelatedServices";
import DetailsLoader from "../../pages/DetailsLoader";
import { getAdById } from "../../redux/Slices/GetAdSlice";
import { Tooltip } from "react-tooltip";
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
const ServiceDetails = () => {
  const { t, i18n } = useTranslation("global");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { record: adItem, isLoading } = useSelector((state) => state.ad);
  const [theme, setTheme] = useState(
    () => sessionStorage.getItem("theme") || "light"
  );
  useEffect(() => {
    if (!adItem?.images?.length) return;

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
  }, [adItem?.images]);

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

    const ad_id = adItem?.id;

    const formData = new FormData();
    formData.append("user_id", userID);
    formData.append("ad_id", ad_id);
    formData.append("rate", rating);
    formData.append("comment", comment);

    try {
      const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const res = await axios.post(
        "https://3ayin.resporthub.com/api/ad/review",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Lang: i18n.language,
          },
        }
      );

      if (res?.data?.code === 200) {
        toast.success(t("servicesPage.rateSuccess"));
        setComment("");
        setRating(0);
        setHovered(0);
        dispatch(getAdById(id));
        getAdReview();
      } else {
        toast.error(t("servicesPage.rateFail"));
      }
    } catch (error) {
      toast.error(t("servicesPage.rateFail"));
    }
  };

  useEffect(() => {
    setReviews([]);
    getAdReview();
    dispatch(getAdById(id));
  }, [id, i18n.language, t]);

  // get ad review
  const getAdReview = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const { data } = await axios.get(
        `https://3ayin.resporthub.com/api/ad/${id}/reviews`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Lang: i18n.language,
          },
        }
      );
      if (data?.code === 200) {
        setReviews(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      getAdReview();
    }
  }, [id]);

  return (
    <>
      <div className="services_details_page bg_overlay">
        <Breadcrumb
          title={adItem?.category_name}
          subTitle={adItem?.sub_category_name}
        />
        <div className="container">
          <div className="services_details_wrapper py-5 position-relative">
            {isLoading ? (
              <DetailsLoader />
            ) : adItem ? (
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
                        {adItem?.images?.length > 0 ? (
                          adItem.images.map((img, i) => (
                            <div
                              key={i}
                              className={`carousel-item ${
                                i === 0 ? "active" : ""
                              }`}
                            >
                              <img
                                src={
                                  img?.image?.trim()
                                    ? img.image
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
                        {adItem?.images?.length > 0 ? (
                          adItem.images.map((img, i) => (
                            <li
                              key={i}
                              data-bs-target="#customCarousel"
                              data-bs-slide-to={i}
                              className={i === 0 ? "active" : ""}
                            >
                              <img
                                src={
                                  img?.image?.trim()
                                    ? img.image
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
                    <h4 className="fw-bold">{adItem?.ad_name}</h4>
                    <div className="user_info my-4 d-flex align-items-center">
                      <img
                        src={adItem?.user?.image || "/user.webp"}
                        onError={(e) => {
                          e.target.onerror = null; // prevent infinite loop
                          e.target.src = "/user.webp";
                        }}
                        alt="--"
                      />
                      <Link to={`/provider_profile/${adItem?.user?.id}`}>
                        <span className="mx-2 fw-bold">
                          {adItem?.user?.name} {""}
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
                    {(adItem?.availability === "متوفر" ||
                      adItem?.availability === "available") && (
                      <small className="available d-inline-block mb-3">
                        {adItem?.availability}
                      </small>
                    )}
                    <h4 className="fw-bold">
                      {adItem?.price} {t("servicesPage.egp")}
                    </h4>
                    <p className="line-height text-md my-4">
                      {adItem?.small_desc}
                    </p>
                    <Link
                      className="contact_with_provider"
                      to={`tel:${
                        adItem?.phone ? adItem?.phone : adItem?.user?.phone
                      }`}
                    >
                      <MdWifiCalling3 />{" "}
                      {t("servicesPage.contactServiceProvider")}
                    </Link>
                    <div className="share d-flex align-items-center my-3">
                      <small className="fw-bold d-block">
                        {t("servicesPage.share")}
                      </small>
                      <div className="d-flex mx-2 gap-2">
                        <FacebookShareButton
                          url={window.location.href}
                          quote={adItem?.small_desc}
                          hashtag="#3ayin"
                        >
                          <FacebookIcon size={22} round />
                        </FacebookShareButton>

                        <TwitterShareButton
                          url={window.location.href}
                          title={adItem?.ad_name}
                        >
                          <FaXTwitter size={22} className="text-dark" />
                        </TwitterShareButton>

                        <LinkedinShareButton
                          url={window.location.href}
                          title={adItem?.ad_name}
                          summary={adItem?.small_desc}
                          source="3ayin"
                        >
                          <LinkedinIcon size={22} round />
                        </LinkedinShareButton>

                        <WhatsappShareButton
                          url={window.location.href}
                          title={adItem?.ad_name}
                          separator=" - "
                        >
                          <WhatsappIcon size={22} round />
                        </WhatsappShareButton>
                        {navigator.share && (
                          <button
                            className="btn btn-sm btn-outline-dark fw-bold d-flex align-items-center share_now"
                            onClick={() =>
                              navigator.share({
                                title: adItem?.ad_name,
                                text: adItem?.small_desc,
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
                      {adItem?.AR_VR && (
                        <>
                          <Link
                            data-tooltip-id="tooltip1"
                            data-tooltip-content={t("services.clickHere")}
                            className="d-block"
                            target="_blank"
                            rel="noopener noreferrer"
                            to={adItem?.AR_VR}
                          >
                            <img src="/vr.png" alt="--" />
                            <small className="fw-bold main-color d-block my-2 text-xs text-center">
                              VR/AR
                            </small>
                          </Link>
                          <Tooltip id="tooltip1" />
                        </>
                      )}
                      {adItem?.location && <img src="/map.png" alt="--" />}
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
                            id="description-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#description"
                            type="button"
                            role="tab"
                            aria-controls="description"
                            aria-selected="true"
                          >
                            {t("servicesPage.description")}
                          </button>
                        </Ripples>
                      </li>
                      <li className="nav-item" role="presentation">
                        <Ripples color="rgba(219, 147, 12, 0.21)" during={1500}>
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
                      <li className="nav-item" role="presentation">
                        <Ripples color="rgba(219, 147, 12, 0.21)" during={1500}>
                          <button
                            className="nav-link"
                            id="portfolio-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#portfolio"
                            type="button"
                            role="tab"
                            aria-controls="portfolio"
                            aria-selected="false"
                          >
                            {t("servicesPage.portfolio")}
                          </button>
                        </Ripples>
                      </li>
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
                        id="description"
                        role="tabpanel"
                        aria-labelledby="description-tab"
                      >
                        <p className="line-height">{adItem?.desc}</p>
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
                              {adItem.location || "--"}
                            </span>
                          </li>
                        </ul>
                        <div className="border rounded-3 p-2 shadow-sm bg-white">
                          {adItem?.location_lat &&
                            adItem?.location_long ? (
                              <iframe
                                title="property-map"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                src={`https://www.google.com/maps?q=${adItem.location_lat},${adItem.location_long}&hl=${i18n.language}&z=15&output=embed`}
                                allowFullScreen
                              ></iframe>
                            ):(<img className="w-100" style={{height:"180px"}} src="/map-location.svg"/>)}
                        </div>
                      </div>
                      <div
                        className="tab-pane fade p-3"
                        id="portfolio"
                        role="tabpanel"
                        aria-labelledby="portfolio-tab"
                      >
                        <div className="row">
                          {adItem?.user_works?.map((img, index) => (
                            <div
                              key={index}
                              className="col-xl-6 col-lg-6 col-md-6 col-12"
                            >
                              <img
                                src={img.image || "/placeholder.jpg"}
                                alt={`image-${index}`}
                                className="d-block w-100 my-2 rounded-5"
                                style={{ height: "300px", objectFit: "cover" }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/placeholder.jpg";
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div
                        className="tab-pane fade p-3"
                        id="ratings"
                        role="tabpanel"
                        aria-labelledby="ratings-tab"
                      >
                        {reviews.length > 0 ? (
                          reviews.map((review) => (
                            <div key={review.id} className="rate_wrapper mb-2">
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
                      <div
                        className="tab-pane fade p-3"
                        id="extraFiles"
                        role="tabpanel"
                        aria-labelledby="extraFiles-tab"
                      >
                        {adItem?.files && adItem.files.length > 0 ? (
                          adItem.files.map((file, index) => {
                            const isPdf = file.file
                              ?.toLowerCase()
                              .endsWith(".pdf");
                            const fileIcon = isPdf ? "/pdf.png" : "/doc.png";

                            return (
                              <div key={index} className="file_wrapper mb-3">
                                <div className="row">
                                  <div className="col-xl-2 col-lg-2 col-md-2 col-12">
                                    <a
                                      href={file.file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <img
                                        src={fileIcon}
                                        alt={file.original_name}
                                        className="d-block my-2"
                                      />
                                    </a>
                                  </div>
                                  <div className="col-xl-10 col-lg-10 col-md-10 col-12">
                                    <a
                                      href={file.file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-decoration-none"
                                    >
                                      {file.original_name || "File"}
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
                            <h5 className="mb-0 text-sm">{t("no_data_exists")}</h5>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-12 col-lg-12 xol-md-12 col-12 position-relative">
                  <RelatedServices
                    adCategory={adItem?.ad_category?.id}
                    currentAdId={adItem?.id}
                  />
                </div>
              </div>
            ) : (
              <div className="no_data bg-white py-5 border rounded-2 my-3 text-center">
                <h5 className="mb-0 text-sm">{t("no_data_exists")}</h5>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default ServiceDetails;
