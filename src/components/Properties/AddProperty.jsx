import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./property.css";
import "leaflet/dist/leaflet.css";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addProperty } from "../../redux/Slices/AddPropertySlice";

import { fetchFacilities } from "../../redux/Slices/FacilitiesSlice";
import GoogleMapPicker from "../PublishAd/GoogleMapPicker";
import { fetchLevels, fetchPropertCategories, fetchPropertCategoriesChilds, fetchPropertCategoriesSubChilds, fetchPurposes, fetchTypes } from "../../redux/Slices/PropertyApisSlice";

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
  const { purposes,types,levels,property_categories,property_categories_childs,property_categories_sub_childs } = useSelector((state) => state.properties_api);
  useEffect(() => {
    dispatch(fetchFacilities());
    dispatch(fetchPurposes());
    dispatch(fetchTypes());
    dispatch(fetchLevels());
    dispatch(fetchPropertCategories());
  }, [dispatch, i18n.language]);
  const [formdata, setFormData] = useState({
    purpose_id:"",
    property_type_id:"",
    property_level_id:"",
    category_id:"",
    sub_category_id:"",
    sub_sub_category_id:"",
    title_ar: "",
    title_en: "",
    description:"",
    rooms: "",
    floor: "",
    area_sqm: "",
    finishing_status: "",
    furniture_status: "",
    price: "",
    payment_method: "",
    address_details: "",
    deposit_amount: "",
    images: [null, null, null, null],
    files: [null, null, null, null],
    latitude: "",
    longitude: "",
    location: "",
    AR_VR: "",
    video_url: "",
    feature_mark: "",
    bathrooms: "",
    garages: "",
    education: 0,
    health: 0,
    transportation: 0,
    facilities: [],
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    if (name === "category_id") {
      // Fetch subcategories when category changes
      dispatch(fetchPropertCategoriesChilds(value));
      // Reset subcategory field
      setFormData((prev) => ({ ...prev, sub_category_id: "" }));
    }
    if (name === "sub_category_id") {
      dispatch(fetchPropertCategoriesSubChilds(value));
      setFormData((prev) => ({ ...prev, sub_sub_category_id: "" }));
    }

    const arabicFields = ["title_ar"];
    const englishFields = ["title_en"];

    if (arabicFields.includes(name)) {
      const hasEnglish = /[A-Za-z]/.test(value);
      if (hasEnglish) {
        toast.warning(t("validation.mustBeArabic"), { toastId: `${name}-lang` });
      }
    }

    if (englishFields.includes(name)) {
      const hasArabic = /[\u0600-\u06FF]/.test(value);
      if (hasArabic) {
        toast.warning(t("validation.mustBeEnglish"), { toastId: `${name}-lang` });
      }
    }

    setFormData((prev) => {
      if (["education", "health", "transportation"].includes(name)) {
        return { ...prev, [name]: checked ? 1 : 0 };
      }

      if (name === "facilities") {
        const featureId = Number(value);
        const updatedFeatures = prev.facilities.includes(featureId)
          ? prev.facilities.filter((id) => id !== featureId)
          : [...prev.facilities, featureId];
        return { ...prev, facilities: updatedFeatures };
      }

      // Case 3: normal text / input fields
      return { ...prev, [name]: value };
    });
  };

  const handleFileInput = (e, key) => {
    const files = Array.from(e.target.files);
    console.log("Uploading to:", key, files);
    if (!files.length) return;

    // Check if total files exceed 4
    const currentFilesCount = formdata[key].filter((f) => f !== null).length;
    if (currentFilesCount + files.length > 4) {
      toast.error(t("validation.You_can_upload_max_4_files"));
      return;
    }

    const imageTypes = ["image/jpeg", "image/png", "image/jpg"];
    const fileTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    let allowedTypes;
    if (key === "images") allowedTypes = imageTypes;
    if (key === "files") allowedTypes = fileTypes;

    // Validate file types
    const invalidFile = files.find((file) => !allowedTypes.includes(file.type));
    if (invalidFile) {
      toast.error(
        `${t("only_allowed")} ${key === "files" ? "PDF, Word, Excel" : "JPG, JPEG, PNG"}`
      );
      return;
    }

    // Fill empty slots in formdata
    setFormData((prev) => {
      const updated = [...prev[key]];
      files.forEach((file) => {
        const emptyIndex = updated.findIndex((f) => f === null);
        if (emptyIndex !== -1) updated[emptyIndex] = file;
      });
      return { ...prev, [key]: updated };
    });

    // Fill empty slots in previews
    setPreviews((prev) => {
      const updated = [...prev[key]];
      files.forEach((file) => {
        const emptyIndex = updated.findIndex((f) => f === null);
        if (emptyIndex !== -1)
          updated[emptyIndex] = key === "files" ? file.name : URL.createObjectURL(file);
      });
      return { ...prev, [key]: updated };
    });

    e.target.value = null; // reset input
  };
  const removeFile = (key, index) => {
    setFormData((prev) => {
      const updated = [...prev[key]];
      updated[index] = null;
      return { ...prev, [key]: updated };
    });

    setPreviews((prev) => {
      const updated = [...prev[key]];
      updated[index] = null;
      return { ...prev, [key]: updated };
    });
  };

  const validateLanguage = (text, shouldBeArabic) => {
    const hasArabic = /[\u0600-\u06FF]/.test(text);
    const hasEnglish = /[A-Za-z]/.test(text);

    if (!text.trim()) return true; // ignore empty
    if (shouldBeArabic && hasEnglish)
      return { valid: false, message: t("validation.mustBeArabic") };
    if (!shouldBeArabic && hasArabic)
      return { valid: false, message: t("validation.mustBeEnglish") };
    return { valid: true };
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
    if (!formdata.purpose_id) {
      toast.error(`${t("property.purpose")} ${t("field")} ${t("is_required")}`);
      return;
    }
    if (!formdata.property_type_id) {
      toast.error(`${t("property.type")} ${t("field")} ${t("is_required")}`);
      return;
    }
    if (!formdata.category_id) {
      toast.error(`${t("property.main_categories")} ${t("field")} ${t("is_required")}`);
      return;
    }

    // Language validation
    const checks = [
      { text: formdata.title_ar, arabic: true, label: t("property.unitNameAr") },
      { text: formdata.title_en, arabic: false, label: t("propert.unitNameEn") },
    ];

    for (const check of checks) {
      const result = validateLanguage(check.text, check.arabic);
      if (!result.valid) {
        toast.error(`${check.label}: ${result.message}`);
        return;
      }
    }
    const data = new FormData();

    data.append("user_id", userID);
    Object.entries(formdata).forEach(([key, value]) => {
      if (["images", "files", "facilities"].includes(key)) return;
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });
    formdata.facilities.forEach((id, index) => {
      data.append(`facilities[${index}]`, id);
    });

    formdata.images
      .filter((file) => file instanceof File)
      .forEach((file) => data.append("images[]", file));
    formdata.files
      .filter((file) => file instanceof File)
      .forEach((file) => data.append("files[]", file));
    

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
              <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                <label className="fw-bold">{t("property.purpose")}</label>
                <select
                  name="purpose_id"
                  onChange={handleChange}
                  value={formdata.purpose_id}
                >
                  <option value="" disabled>
                    {t("property.select_item")}
                  </option>
                  {purposes && purposes.length > 0 && purposes.map((purpose) => <option key={purpose.id} value={purpose.id}>{purpose.name}</option>)}
                </select>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                <label className="fw-bold">{t("property.type")}</label>
                <select
                  name="property_type_id"
                  onChange={handleChange}
                  value={formdata.property_type_id}
                >
                  <option value="" disabled>
                    {t("property.select_item")}
                  </option>
                  {types && types.length > 0 && types.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
                </select>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                <label className="fw-bold">{t("property.level")}</label>
                <select
                  name="property_level_id"
                  onChange={handleChange}
                  value={formdata.property_level_id}
                >
                  <option value="" disabled>
                    {t("property.select_item")}
                  </option>
                  {levels && levels.length > 0 && levels.map((level) => <option key={level.id} value={level.id}>{level.name}</option>)}
                </select>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                <label className="fw-bold">{t("property.main_categories")}</label>
                <select
                  name="category_id"
                  onChange={handleChange}
                  value={formdata.category_id}
                >
                  <option value="" disabled>
                    {t("property.select_item")}
                  </option>
                  {property_categories && property_categories.length > 0 && property_categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                <label className="fw-bold">{t("property.sub_categories")}</label>
                <select
                  name="sub_category_id"
                  onChange={handleChange}
                  value={formdata.sub_category_id}
                  disabled={!formdata.category_id}
                  style={{
                    backgroundColor: !formdata.category_id ? "#eee" : ""
                  }}
                >
                  <option value="" disabled>
                    {t("property.select_item")}
                  </option>
                  {property_categories_childs && property_categories_childs.length > 0 && property_categories_childs.map((child) => <option key={child.id} value={child.id}>{child.name}</option>)}
                </select>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                <label className="fw-bold">{t("property.sub_sub_categories")}</label>
                <select
                  name="sub_sub_category_id"
                  onChange={handleChange}
                  value={formdata.sub_sub_category_id}
                  disabled={!formdata.sub_category_id || !property_categories_sub_childs?.length}
                  style={{
                    backgroundColor:
                      !formdata.sub_category_id || !property_categories_sub_childs?.length
                        ? "#eee"
                        : "",
                  }}
                >
                  <option value="" disabled>
                    {t("property.select_item")}
                  </option>
                  {property_categories_sub_childs && property_categories_sub_childs.length > 0 && property_categories_sub_childs.map((subChild) => <option key={subChild.id} value={subChild.id}>{subChild.name}</option>)}
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
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">{t("property.description")}</label>
                <textarea name="description" value={formdata.description} onChange={handleChange}></textarea>
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
                <label className="fw-bold">{t("create_ad.price")}</label>
                <input
                  type="text"
                  name="price"
                  min="0"
                  inputMode="numeric"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                  }}
                  onChange={handleChange}
                  value={formdata.price}
                />
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">{t("property.paymentMethod")}</label>
                <select
                  type="text"
                  name="payment_method"
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
                  placeholder={`(${t("property.addressRegion")} - ${t(
                    "property.addressStreet"
                  )} - ${t("property.addressLandmark")})`}
                ></textarea>
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">{t("create_ad.uploadImages")}</label>
                <div className="row">
                  {previews.images.map((fileName, index) => (
                    <div className="col-xl-3 col-lg-3 col-md-6 col-6" key={index}>
                      <div className="photo_wrapper">
                        <input
                          type="file"
                          multiple
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => handleFileInput(e, "images")}
                        />
                        {fileName ? (
                          <>
                            <img src={fileName} alt="image" />
                            <span
                              className="remove-file"
                              onClick={() => removeFile("images", index)}
                            >
                              ×
                            </span>
                            <span>{t("create_ad.uploadedFile")}</span>
                          </>
                        ) : (
                          <>
                            <img src="/camera.png" alt="upload" />
                            <span>{t("create_ad.uploadImage")}</span>
                          </>
                        )}
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

                    <GoogleMapPicker
                      onSelect={({ latitude, longitude, location }) => {
                        setFormData((prev) => ({
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
                  name="feature_mark"
                  onChange={handleChange}
                  value={formdata.feature_mark}
                />
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">
                  {t("property.count_of_bathrooms")}
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  onChange={handleChange}
                  min="0"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                  }}
                  value={formdata.bathrooms}
                />
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">
                  {t("property.number_of_parking_spaces")}
                </label>
                <input
                  type="number"
                  name="garages"
                  onChange={handleChange}
                  min="0"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                  }}
                  value={formdata.garages}
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
                      checked={formdata.education === 1}
                    />
                  </div>
                  <div className="col-xl-4 col-lg-64 col-md-6 col-12">
                    <label className="fw-bold">
                      {t("property.health_and_medicine")}
                    </label>
                    <input
                      type="checkbox"
                      name="health"
                      className="no-class"
                      onChange={handleChange}
                      checked={formdata.health === 1}
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
                      checked={formdata.transportation === 1}
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
                            name="facilities"
                            className="no-class mx-2"
                            value={f.id}
                            checked={formdata.facilities.includes(f.id)}
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
                    <div className="col-xl-3 col-lg-3 col-md-6 col-6" key={index}>
                      <div className="photo_wrapper">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx"
                          onChange={(e) => handleFileInput(e, "files")}
                        />
                        {fileName ? (
                          <>
                            <img src="/file.png" alt="file" />
                            <span>{fileName}</span>
                            <span
                              className="remove-file"
                              onClick={() => removeFile("files", index)}
                            >
                              ×
                            </span>
                            <span>{t("create_ad.uploadedFile")}</span>
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
