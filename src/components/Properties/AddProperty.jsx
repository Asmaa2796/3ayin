import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./property.css";
import "leaflet/dist/leaflet.css";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addProperty } from "../../redux/Slices/AddPropertySlice";
import MapPicker from "./MapPicker";
import { fetchFacilities } from "../../redux/Slices/FacilitiesSlice";

const AddProperty = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const user3ayin = JSON.parse(sessionStorage.getItem("user3ayin"));
  const userID = user3ayin?.user?.id;
  const userType = user3ayin?.user?.type;
  const [previews, setPreviews] = useState({
    images: [null, null, null, null],
    files: [null, null, null, null],
  });

  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const { success, error, isLoading } = useSelector((state) => state.property);
  const { facilities } = useSelector((state) => state.facilities);

  useEffect(() => {
    dispatch(fetchFacilities());
  }, [dispatch, i18n.language]);
  const [formdata, setFormata] = useState({
    category: "",
    unit_type: "",
    title_ar: "",
    title_en: "",
    rooms: "",
    floor: "",
    area_sqm: "",
    finishing_status: "",
    furniture_status: "",
    price: "",
    payment_method: "",
    address_details: "",
    deposit_amount: "",
    images: [], // array of images
    files: [], // array of files
    latitude: "",
    longitude: "",
    location: "",
    AR_VR: "",
    video_url: "",
    distinctive_signs: "",
    count_of_bathrooms: "",
    number_of_parking_spaces: "",
    education: false,
    health_and_medicine: false,
    transportation: false,
    unit_features: [],
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setFormata((prev) => {
      // Case 1: handle normal boolean checkboxes
      if (
        ["education", "health_and_medicine", "transportation"].includes(name)
      ) {
        return { ...prev, [name]: checked };
      }

      if (name === "unit_features") {
        const featureId = Number(value);
        const updatedFeatures = prev.unit_features.includes(featureId)
          ? prev.unit_features.filter((id) => id !== featureId)
          : [...prev.unit_features, featureId];

        return { ...prev, unit_features: updatedFeatures };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleFileInput = (e, key, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageTypes = ["image/jpeg", "image/png", "image/jpg"];
    const fileTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    let allowedTypes;
    if (key === "images") allowedTypes = imageTypes;
    if (key === "files") allowedTypes = fileTypes;

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        `${t("only_allowed")} ${
          key === "files" ? "PDF, Word" : "JPG, JPEG, PNG"
        }`
      );
      return;
    }

    // update formdata with actual file
    setFormata((prev) => {
      const newFiles = [...prev[key]];
      newFiles[index] = file;
      return { ...prev, [key]: newFiles };
    });

    // update preview for images and user_works
    if (key === "images") {
      setPreviews((prev) => {
        const newPreviews = { ...prev };
        newPreviews[key][index] = URL.createObjectURL(file);
        return newPreviews;
      });
    } else if (key === "files") {
      setPreviews((prev) => {
        const newPreviews = { ...prev };
        newPreviews[key][index] = file.name; // show file name instead of image
        return newPreviews;
      });
    }

    e.target.value = null; // allow reselecting same file
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formdata.AR_VR && !formdata.AR_VR.startsWith("https://")) {
      toast.error(t("property.AR_VRLinkInvalid"));
      return;
    }
    if (formdata.video_url && !formdata.video_url.startsWith("https://")) {
      toast.error(t("property.videoLinkInvalid"));
      return;
    }

    const data = new FormData();

    data.append("user_id", userID);
    Object.entries(formdata).forEach(([key, value]) => {
      if (["images", "files"].includes(key)) return;
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    formdata.images.forEach((file) => data.append("images[]", file));
    formdata.files.forEach((file) => data.append("files[]", file));

    // console.log("FormData contents:");
    // for (let [key, value] of data.entries()) {
    //   console.log(key, value instanceof File ? value.name : value);
    // }

    dispatch(addProperty(data));
  };

  useEffect(() => {
    if (success) {
      toast.success(t("request_added_success"), {
        onClose: () => {
          dispatch({ type: "property/clearState" });
          navigate("/all_properties");
        },
      });
    } else if (error) {
      toast.error(t("failedToAdd"), {
        onClose: () => dispatch({ type: "property/clearState" }),
      });
    }
  }, [success, error, t, dispatch, navigate]);

  return (
    <div className="form_holder">
      <Breadcrumb title={t("property.add_property")} />
      <div className="container">
        <div className="add_property py-4">
          <form className="form-style" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <h4
                  className="fw-bold my-4 position-relative"
                  style={{ fontSize: "22px" }}
                >
                  {t("property.select_category")}
                </h4>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">{t("property.unitCategory")}</label>
                <select
                  type="text"
                  name="category"
                  onChange={handleChange}
                  value={formdata.category}
                  required
                >
                  <option value="" disabled>
                    {t("property.select_item")}
                  </option>
                  <option value="sale">{t("property.sale")}</option>
                  <option value="rent">{t("property.rent")}</option>
                  <option value="share">{t("property.share")}</option>
                </select>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">{t("property.unitType")}</label>
                <select
                  type="text"
                  name="unit_type"
                  onChange={handleChange}
                  required
                  value={formdata.unit_type}
                >
                  <option value="" disabled>
                    {t("property.select_item")}
                  </option>
                  <option value="apartment">{t("property.apartment")}</option>
                  <option value="building">{t("property.building")}</option>
                  <option value="villa">{t("property.villa")}</option>
                  <option value="duplex">{t("property.duplex")}</option>
                  <option value="office">{t("property.office")}</option>
                  <option value="shop">{t("property.shop")}</option>
                  <option value="warehouse">{t("property.warehouse")}</option>
                  <option value="land">{t("property.land")}</option>
                  <option value="chalet">{t("property.chalet")}</option>
                </select>
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <hr />
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <h4
                  className="fw-bold my-4 position-relative"
                  style={{ fontSize: "22px" }}
                >
                  {t("property.property_details")}
                </h4>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">{t("property.unitNameAr")}</label>
                <input
                  type="text"
                  name="title_ar"
                  required
                  onChange={handleChange}
                  value={formdata.title_ar}
                />
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">{t("property.unitNameEn")}</label>
                <input
                  type="text"
                  name="title_en"
                  required
                  onChange={handleChange}
                  value={formdata.title_en}
                />
              </div>

              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">{t("property.area")}</label>
                <input
                  type="number"
                  min="0"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                  }}
                  required
                  name="area_sqm"
                  onChange={handleChange}
                  value={formdata.area_sqm}
                />
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">{t("property.rooms")}</label>
                <input
                  type="number"
                  min="0"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                  }}
                  required
                  name="rooms"
                  onChange={handleChange}
                  value={formdata.rooms}
                />
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">{t("property.floor")}</label>
                <input
                  type="number"
                  min="0"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                  }}
                  name="floor"
                  onChange={handleChange}
                  value={formdata.floor}
                />
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">
                  {t("property.finishingStatus")}
                </label>
                <select
                  type="text"
                  required
                  name="finishing_status"
                  onChange={handleChange}
                  value={formdata.finishing_status}
                >
                  <option value="" disabled>
                    {t("property.select_item")}
                  </option>
                  <option value="semi">{t("property.finishingSemi")}</option>
                  <option value="full">{t("property.finishingFull")}</option>
                  <option value="superLux">
                    {t("property.finishingSuperLux")}
                  </option>
                  <option value="company">
                    {t("property.finishingCompany")}
                  </option>
                </select>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">
                  {t("property.furnitureStatus")}
                </label>
                <select
                  type="text"
                  required
                  name="furniture_status"
                  onChange={handleChange}
                  value={formdata.furniture_status}
                >
                  <option value="" disabled>
                    {t("property.select_item")}
                  </option>
                  <option value="empty">{t("property.furnitureEmpty")}</option>
                  <option value="furnished">
                    {t("property.furnitureFurnished")}
                  </option>
                  <option value="semi">{t("property.furnitureSemi")}</option>
                  <option value="none">{t("property.furnitureNone")}</option>
                </select>
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <hr />
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">{t("property.price")}</label>
                <input
                  type="text"
                  name="price"
                  min="0"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                  }}
                  required
                  onChange={handleChange}
                  value={formdata.price}
                />
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">{t("property.paymentMethod")}</label>
                <select
                  type="text"
                  name="payment_method"
                  required
                  onChange={handleChange}
                  value={formdata.payment_method}
                >
                  <option value="" disabled>
                    {t("property.select_item")}
                  </option>
                  <option value="cash">{t("property.paymentCash")}</option>
                  <option value="installments">
                    {t("property.paymentInstallments")}
                  </option>
                  <option value="monthly">
                    {t("property.paymentMonthly")}
                  </option>
                </select>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">{t("property.deposit")}</label>
                <input
                  type="number"
                  min="0"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                  }}
                  name="deposit_amount"
                  onChange={handleChange}
                  value={formdata.deposit_amount}
                />
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">
                  {t("property.detailedAddress")}
                </label>
                <textarea
                  name="address_details"
                  onChange={handleChange}
                  value={formdata.address_details}
                  required
                  placeholder={`(${t("property.addressRegion")} - ${t(
                    "property.addressStreet"
                  )} - ${t("property.addressLandmark")})`}
                ></textarea>
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">{t("create_ad.uploadImages")}</label>
                <div className="row">
                  {previews.images.map((preview, index) => (
                    <div
                      className="col-xl-3 col-lg-3 col-md-6 col-6"
                      key={index}
                    >
                      <div className="photo_wrapper">
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => handleFileInput(e, "images", index)}
                        />
                        <img src={preview || "/camera.png"} alt="preview" />
                        <span>{t("create_ad.uploadImage")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">{t("create_ad.location")}</label>
                <input
                  type="text"
                  name="location"
                  value={formdata.location}
                  onChange={handleChange}
                  placeholder={t("create_ad.useCurrentLocation")}
                />

                <button
                  type="button"
                  className="btn btn-outline-primary mt-2"
                  onClick={() => setShowMap(true)}
                >
                  {t("property.pickFromMap")}
                </button>

                {showMap && (
                  <div className="mt-3">
                    <MapPicker
                      lang={i18n.language}
                      onSelect={({ latitude, longitude, location }) => {
                        setFormata((prev) => ({
                          ...prev,
                          latitude,
                          longitude,
                          location,
                        }));
                        setShowMap(false);
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">{t("create_ad.arVr")}</label>
                <input
                  type="text"
                  name="AR_VR"
                  placeholder={`${t("create_ad.link")} VR/AR`}
                  onChange={handleChange}
                  value={formdata.AR_VR}
                />
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">{t("property.video_url")}</label>
                <input
                  type="text"
                  name="video_url"
                  placeholder={t("create_ad.link")}
                  onChange={handleChange}
                  value={formdata.video_url}
                />
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">
                  {t("property.distinctive_signs")}
                </label>
                <input
                  type="text"
                  name="distinctive_signs"
                  onChange={handleChange}
                  value={formdata.distinctive_signs}
                />
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">
                  {t("property.count_of_bathrooms")}
                </label>
                <input
                  type="number"
                  name="count_of_bathrooms"
                  onChange={handleChange}
                  min="0"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                  }}
                  value={formdata.count_of_bathrooms}
                />
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">
                  {t("property.number_of_parking_spaces")}
                </label>
                <input
                  type="number"
                  name="number_of_parking_spaces"
                  onChange={handleChange}
                  min="0"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                  }}
                  value={formdata.number_of_parking_spaces}
                />
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <div className="row">
                  <div className="col-xl-4 col-lg-64 col-md-6 col-12">
                    <label className="fw-bold">{t("property.education")}</label>
                    <input
                      type="checkbox"
                      name="education"
                      className="no-class"
                      onChange={handleChange}
                      checked={formdata.education}
                    />
                  </div>
                  <div className="col-xl-4 col-lg-64 col-md-6 col-12">
                    <label className="fw-bold">
                      {t("property.health_and_medicine")}
                    </label>
                    <input
                      type="checkbox"
                      name="health_and_medicine"
                      className="no-class"
                      onChange={handleChange}
                      checked={formdata.health_and_medicine}
                    />
                  </div>
                  <div className="col-xl-4 col-lg-64 col-md-6 col-12">
                    <label className="fw-bold">
                      {t("property.transportation")}
                    </label>
                    <input
                      type="checkbox"
                      className="no-class"
                      name="transportation"
                      onChange={handleChange}
                      checked={formdata.transportation}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">{t("property.unit_features")}</label>
                <div className="row">
                  {facilities &&
                    facilities.length > 0 &&
                    facilities.map((f, index) => (
                      <div
                        className="col-xl-3 col-lg-3 col-md-6 col-12"
                        key={f.id || index}
                      >
                        <label
                          style={{ cursor: "pointer" }}
                          className="d-inline-block my-2"
                        >
                          <input
                            type="checkbox"
                            name="unit_features"
                            className="no-class mx-2"
                            value={f.id}
                            checked={formdata.unit_features.includes(f.id)}
                            onChange={handleChange}
                          />
                          <span>{f.name}</span>
                        </label>
                      </div>
                    ))}
                </div>
                <hr />
              </div>

              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">
                  {t("create_ad.additional_details")}
                </label>
                <div className="row">
                  {previews.files.map((fileName, index) => (
                    <div
                      className="col-xl-3 col-lg-3 col-md-6 col-6"
                      key={index}
                    >
                      <div className="photo_wrapper">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileInput(e, "files", index)}
                        />
                        {fileName ? (
                          <>
                            <img src="/file.png" alt="file" />
                            <span>{fileName}</span>
                          </>
                        ) : (
                          <>
                            <img src="/camera.png" alt="upload" />
                            <span>{t("create_ad.uploadFile")}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <div className="form_btn">
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? t("loading") : t("create_ad.publishNow")}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
