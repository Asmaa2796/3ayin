import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import "./PublishAd.css";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { storeAd } from "../../redux/Slices/PublishAdSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/Slices/CategoriesSlice";
import { fetchSubCategories } from "../../redux/Slices/SubCategoriesSlice";
import { fetchSubCatsOfSubCategories } from "../../redux/Slices/SubCatsOfSubCategoriesSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MapPicker from "../Properties/MapPicker";

const PublishAd = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const user3ayin = JSON.parse(sessionStorage.getItem("user3ayin"));
  const userID = user3ayin?.user?.id;
  const userType = user3ayin?.user?.type;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedSubCatsOfSubCategories, setSelectedSubCatsOfSubCategories] =
    useState(null);
  const [isSubSubRequired, setIsSubSubRequired] = useState(false);
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
    user_works: [], // array of images
    images: [], // array of images
    files: [], // array of files
    location: "",
    location_lat: "",
    location_long: "",
    AR_VR: "",
    phone: "",
    ad_category_id: null, // take id of category
    ad_sub_category_id: null, // take id of sub category
    ad_sub_sub_category_id: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    if (key === "images" || key === "user_works") allowedTypes = imageTypes;
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
    if (key === "images" || key === "user_works") {
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

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
    dispatch(fetchSubCatsOfSubCategories());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

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

    const data = new FormData();

    data.append("user_id", userID);
    Object.entries(formdata).forEach(([key, value]) => {
      if (["images", "user_works", "files"].includes(key)) return;
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    formdata.images.forEach((file) => data.append("images[]", file));
    formdata.user_works.forEach((file) => data.append("user_works[]", file));
    formdata.files.forEach((file) => data.append("files[]", file));

    // console.log(formdata);
    dispatch(storeAd(data));
  };

  useEffect(() => {
    if (success) {
      toast.success(t("request_added_success"), {
        onClose: () => {
          dispatch({ type: "ad/clearState" });
          navigate("/all_ads");
        },
      });
    }

    if (error) {
      toast.error(t("failedToAdd"), {
        onClose: () => dispatch({ type: "ad/clearState" }),
      });
    }
  }, [success, error, t, dispatch, navigate]);

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
                  onChange={handleChange}
                  value={formdata.price}
                />
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                <label className="fw-bold">{t("create_ad.phone")}</label>
                <input
                  type="text"
                  name="phone"
                  onChange={handleChange}
                  value={formdata.phone}
                />
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
                <label className="fw-bold">{t("create_ad.portfolio")}</label>
                <div className="row">
                  {previews.user_works.map((preview, index) => (
                    <div
                      className="col-xl-3 col-lg-3 col-md-6 col-6"
                      key={index}
                    >
                      <div className="photo_wrapper">
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) =>
                            handleFileInput(e, "user_works", index)
                          }
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
                      onSelect={({ location_lat, location_long, location }) => {
                        setFormata((prev) => ({
                          ...prev,
                          location_lat,
                          location_long,
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
                  placeholder={t("create_ad.link")}
                  onChange={handleChange}
                  value={formdata.AR_VR}
                />
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

export default PublishAd;
