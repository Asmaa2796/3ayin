import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import "./PublishAd.css";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { storeAd, clearState } from "../../redux/Slices/PublishAdSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/Slices/CategoriesSlice";
import { fetchSubCategories } from "../../redux/Slices/SubCategoriesSlice";
import { fetchSubCatsOfSubCategories } from "../../redux/Slices/SubCatsOfSubCategoriesSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axios from "axios";
import GoogleMapPicker from "./GoogleMapPicker";

const PublishAd = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const user3ayin = JSON.parse(sessionStorage.getItem("user3ayin"));
  const [subscriptionData, setSubscriptionData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const userID = user3ayin?.user?.id;
  const userType = user3ayin?.user?.type;
  const userData = JSON.parse(sessionStorage.getItem("user3ayin"));
  const token = userData?.token;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [selectedSubCatsOfSubCategories, setSelectedSubCatsOfSubCategories] =
    useState(null);
  const [isSubSubRequired, setIsSubSubRequired] = useState(false);
  const [isLoadingStoreAd, setIsLoadingStoreAd] = useState(false);
  const { categories } = useSelector((state) => state.categories);
  const { subcategories } = useSelector((state) => state.subcategories);
  const [showMap, setShowMap] = useState(false);
  const [previews, setPreviews] = useState({
    images: [null, null, null, null],
    user_works: [null, null, null, null],
    files: [null, null, null, null],
  });
  const { subCatsOfSubCategories } = useSelector(
    (state) => state.subCatsOfSubCategories
  );
  const navigate = useNavigate();
  const { success, error, isLoading } = useSelector((state) => state.ad);
  const categoryOptions = categories
    .filter((cat) => {
      if (userType === "individual") return cat.id !== 3;
      if (userType === "company") return cat.id !== 2;
      return true;
    })
    .map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));
  const [formdata, setFormata] = useState({
    ad_name_ar: "",
    ad_name_en: "",
    small_desc_en: "", // required
    small_desc_ar: "", // required
    desc_ar: "", // required
    desc_en: "", // required
    price: "",
    user_works: [null, null, null, null],
    images: [null, null, null, null],
    files: [null, null, null, null],
    location: "",
    location_lat: "",
    location_long: "",
    AR_VR: "",
    video_link: "",
    phone: "",
    ad_category_id: null, // take id of category
    ad_sub_category_id: null, // take id of sub category
    ad_sub_sub_category_id: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    const arabicFields = ["ad_name_ar", "small_desc_ar", "desc_ar"];
    const englishFields = ["ad_name_en", "small_desc_en", "desc_en"];

    if (arabicFields.includes(name)) {
      const result = validateLanguage(value, true);
      if (!result.valid) {
        toast.warning(result.message, { toastId: `${name}-lang` });
      }
    }

    if (englishFields.includes(name)) {
      const result = validateLanguage(value, false);
      if (!result.valid) {
        toast.warning(result.message, { toastId: `${name}-lang` });
      }
    }

    setFormata((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    setSelectedSubCategory(null); // reset sub
    setSelectedSubCatsOfSubCategories(null); // reset sub-sub
    setFormata((prev) => ({
      ...prev,
      ad_category_id: selectedOption?.value || null,
      ad_sub_category_id: null, // reset sub in form
    }));
  };

  const handleSubCategoryChange = (selectedOption) => {
    setSelectedSubCategory(selectedOption);
    setSelectedSubCatsOfSubCategories(null); // reset sub-sub

    // Find the subcategory object matching selectedOption.value
    const subcategory = subcategories.find(
      (sub) => String(sub.id) === String(selectedOption?.value)
    );

    // Check if this subcategory has sub-sub-categories
    const hasSubSub = subcategory?.sub_sub_categories?.length > 0;

    setIsSubSubRequired(hasSubSub); // update state

    setFormata((prev) => ({
      ...prev,
      ad_sub_category_id: selectedOption?.value || null,
    }));
  };

  const handleSubSubCategoryChange = (selectedOption) => {
    setSelectedSubCatsOfSubCategories(selectedOption);

    setFormata((prev) => ({
      ...prev,
      ad_sub_sub_category_id: selectedOption?.value || null,
    }));
  };
  // Filter Sub Categories by selected Category
  const filteredSubCategories = subcategories.filter(
    (sub) => sub.category_id === String(selectedCategory?.value)
  );
  const subcategoriesOptionsFiltered = filteredSubCategories.map((subCat) => ({
    value: subCat.id,
    label: subCat.name,
  }));

  // Filter Sub Sub Categories by selected Sub Category
  const filteredSubCatsOfSubCategories = subCatsOfSubCategories.flatMap(
    (category) =>
      category.sub_sub_categories.filter(
        (subSubCat) =>
          String(subSubCat.sub_category_id) ===
          String(selectedSubCategory?.value)
      )
  );

  const subCatsOfSubCategoriesOptionsFiltered =
    filteredSubCatsOfSubCategories.map((subSubCat) => ({
      value: subSubCat.id,
      label: subSubCat.name,
    }));

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
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    ];

    let allowedTypes;
    if (key === "images" || key === "user_works") allowedTypes = imageTypes;
    if (key === "files") allowedTypes = fileTypes;

    const validFiles = files.filter((file) => allowedTypes.includes(file.type));
    if (validFiles.length !== files.length) {
      toast.error(
        `${t("only_allowed")} ${key === "files" ? "PDF, Word, Excel" : "JPG, JPEG, PNG"
        }`
      );
      return;
    }

    setFormata((prev) => {
      const updated = [...prev[key]];
      validFiles.forEach((file) => {
        const emptyIndex = updated.findIndex((f) => f === null);
        if (emptyIndex !== -1) updated[emptyIndex] = file;
      });
      return { ...prev, [key]: updated };
    });

    setPreviews((prev) => {
      const updated = [...prev[key]];
      validFiles.forEach((file) => {
        const emptyIndex = updated.findIndex((f) => f === null);
        if (emptyIndex !== -1)
          updated[emptyIndex] = key === "files" ? file.name : URL.createObjectURL(file);
      });
      return { ...prev, [key]: updated };
    });

    e.target.value = null; // reset input
  };

  const removeFile = (key, index) => {
    setFormata((prev) => {
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

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
    dispatch(fetchSubCatsOfSubCategories());
  }, [dispatch, i18n.language]);

  const getProfileData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/profileData`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          Lang: i18n.language,
        },
      });

      setSubscriptionData(response.data.data?.user?.subscription);
      if (!subscriptionData) return;
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getProfileData();
  }, []);

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(sessionStorage.getItem("user3ayin"));
    const subscriptionData = user?.user?.subscription;

    if (!subscriptionData) {
      toast.error(t("please_log_in_to_continue"));
      return;
    }

    const adsLimit = parseInt(subscriptionData.ads_limit, 10);
    const imagesLimit = parseInt(subscriptionData.images_limit, 10);
    const vrTours = parseInt(subscriptionData.vr_tours, 10);
    // const hasVideo = subscriptionData.video; // boolean
    const endDate = new Date(subscriptionData.end_date);
    const today = new Date();

    if (endDate < today) {
      toast.warning(t("planExpired"));
      navigate("/packages");
      return;
    }

    if (
      adsLimit === 0 ||
      imagesLimit === 0 ||
      vrTours === 0
    ) {
      toast.warning(t("planLimitReached"));
      navigate("/packages");
      return;
    }
    if (!formdata.ad_category_id) {
      toast.error(t("category"));
      return;
    }

    const selectedSubCatHasSubSub = subCatsOfSubCategories.some(
      (subCat) =>
        subCat.sub_category_id === selectedSubCategory?.value &&
        subCat.sub_sub_categories.length > 0
    );

    if (selectedSubCatHasSubSub && !selectedSubCatsOfSubCategories) {
      toast.error(t("sub_sub_category"));
      return;
    }

    if (formdata.AR_VR && !formdata.AR_VR.startsWith("https://")) {
      toast.error(t("property.AR_VRLinkInvalid"));
      return;
    }
    if (formdata.video_link && !formdata.video_link.startsWith("https://")) {
      toast.error(t("property.videoLinkInvalid"));
      return;
    }
    // Language validation
    const checks = [
      { text: formdata.ad_name_ar, arabic: true, label: t("create_ad.ad_name_ar") },
      { text: formdata.ad_name_en, arabic: false, label: t("create_ad.ad_name_en") },
      { text: formdata.small_desc_ar, arabic: true, label: t("create_ad.main_description_ar") },
      { text: formdata.small_desc_en, arabic: false, label: t("create_ad.main_description_en") },
      { text: formdata.desc_ar, arabic: true, label: t("create_ad.detailed_description_ar") },
      { text: formdata.desc_en, arabic: false, label: t("create_ad.detailed_description_en") },
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
      if (["images", "user_works", "files"].includes(key)) return;
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });
    formdata.images
      .filter((file) => file instanceof File)
      .forEach((file) => data.append("images[]", file));

    formdata.user_works
      .filter((file) => file instanceof File)
      .forEach((file) => data.append("user_works[]", file));

    formdata.files
      .filter((file) => file instanceof File)
      .forEach((file) => data.append("files[]", file));


    // console.log("FormData contents:");
    // for (let [key, value] of data.entries()) {
    //   console.log(key, value instanceof File ? value.name : value);
    // }
    // console.log("formdata before append:", formdata);
    setIsLoadingStoreAd(true);
    try {
      const res = await dispatch(storeAd(data)).unwrap();

      toast.success(t("request_added_success"));
      dispatch(clearState());
      navigate("/all_ads");
    } catch (err) {
      let errorMessage = t("failedToAdd");

      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      if (errorMessage.includes("complete your identification information")) {
        toast.error(t("please_complete_identification"));
        navigate("/user_profile");
      }
      else if (
        errorMessage.includes("plan limit") ||
        errorMessage.includes("limit reached")
      ) {
        toast.error(t("planLimitReached"));
        navigate("/packages");
      }
      else if (
        errorMessage.includes("You have reached your ad limit. Please subscribe to a new plan")
      ) {
        toast.error(t("ad_limit_reached"));
      }
      else {
        toast.error(t("failedToAdd") || errorMessage);
      }

      dispatch(clearState());
    } finally {
      setIsLoadingStoreAd(false);
    }
  };

  return (
    <div className="form_holder">
      <Breadcrumb title={t("create_ad.publishAd")} />
      <div className="container">
        <div className="publish_ad py-4">
          <form className="form-style" onSubmit={handleSubmit}>
            <h4 className="fw-bold mb-4 position-relative">
              {t("create_ad.selectCategory")}
            </h4>
            <div className="row">
              <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                <label className="fw-bold">{t("create_ad.section")}</label>
                <Select
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  placeholder={t("create_ad.select_section")}
                  isClearable
                />
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                <label className="fw-bold">{t("create_ad.type")}</label>
                <Select
                  options={subcategoriesOptionsFiltered}
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  placeholder={t("create_ad.select_type")}
                  isClearable
                  isDisabled={!selectedCategory} // disabled if no category selected
                />
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                <label className="fw-bold">
                  {t("create_ad.service_category")}
                </label>
                <Select
                  options={subCatsOfSubCategoriesOptionsFiltered}
                  value={selectedSubCatsOfSubCategories}
                  onChange={handleSubSubCategoryChange}
                  placeholder={t("create_ad.select_service_category")}
                  isClearable
                  isDisabled={!selectedSubCategory || !isSubSubRequired}
                />
              </div>
            </div>
            <br />
            <h4 className="fw-bold mb-4 position-relative">
              {t("create_ad.ad_details")}
            </h4>
            <div className="row">
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">{t("create_ad.ad_name_ar")}</label>
                <input
                  type="text"
                  name="ad_name_ar"
                  required
                  onChange={handleChange}
                  value={formdata.ad_name_ar}
                />
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">{t("create_ad.ad_name_en")}</label>
                <input
                  type="text"
                  name="ad_name_en"
                  required
                  onChange={handleChange}
                  value={formdata.ad_name_en}
                />
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">
                  {t("create_ad.main_description_ar")}
                </label>
                <input
                  type="text"
                  name="small_desc_ar"
                  required
                  onChange={handleChange}
                  value={formdata.small_desc_ar}
                />
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">
                  {t("create_ad.main_description_en")}
                </label>
                <input
                  type="text"
                  required
                  name="small_desc_en"
                  onChange={handleChange}
                  value={formdata.small_desc_en}
                />
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">
                  {t("create_ad.detailed_description_ar")}
                </label>
                <textarea
                  name="desc_ar"
                  required
                  onChange={handleChange}
                  value={formdata.desc_ar}
                ></textarea>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                <label className="fw-bold">
                  {t("create_ad.detailed_description_en")}
                </label>
                <textarea
                  name="desc_en"
                  required
                  onChange={handleChange}
                  value={formdata.desc_en}
                ></textarea>
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">
                  {t("create_ad.starting_price")}
                </label>
                <input
                  type="number"
                  name="price"
                  inputMode="numeric"
                  min="0"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                  }}
                  onChange={handleChange}
                  value={formdata.price}
                />
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">{t("create_ad.phone")}</label>
                <input
                  type="number"
                  name="phone"
                  inputMode="numeric"
                  min="0"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only digits
                  }}
                  onChange={handleChange}
                  value={formdata.phone}
                />
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
                <label className="fw-bold">{t("create_ad.portfolio")}</label>
                <div className="row">
                  {previews.user_works.map((fileName, index) => (
                    <div className="col-xl-3 col-lg-3 col-md-6 col-6" key={index}>
                      <div className="photo_wrapper">
                        <input
                          type="file"
                          multiple
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => handleFileInput(e, "user_works")}
                        />
                        {fileName ? (
                          <>
                            <img src={fileName} alt="work" />
                            <span
                              className="remove-file"
                              onClick={() => removeFile("user_works", index)}
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
                        setFormata((prev) => ({
                          ...prev,
                          location_lat: latitude,
                          location_long: longitude,
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
                  placeholder={`${t("create_ad.link")} AR/VR`}
                  onChange={handleChange}
                  value={formdata.AR_VR}
                />
              </div>
              {subscriptionData?.video === true && (
                <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                  <label className="fw-bold">
                    {t("packages.features.video")}
                  </label>
                  <input
                    type="text"
                    name="video_link"
                    placeholder={`${t("create_ad.link")}`}
                    onChange={handleChange}
                    value={formdata.video_link}
                  />
                </div>
              )}
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
                  <button type="submit" disabled={isLoadingStoreAd}>
                    {isLoadingStoreAd
                      ? t("loading")
                      : t("create_ad.publishNow")}
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

export default PublishAd;