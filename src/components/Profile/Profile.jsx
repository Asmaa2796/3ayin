import React, { useEffect, useState } from "react";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import "../PublishAd/PublishAd.css";
import "./Profile.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import axios from "axios";
import {
  storeUserIdentifies,
  updateUserIdentifies,
  clearState,
} from "../../redux/Slices/UserIdentifiesSlice";
const Profile = () => {
  const { t, i18n } = useTranslation("global");
  const user = JSON.parse(sessionStorage.getItem("user3ayin"));
  const userID = user?.user?.id;
  const [previewImage, setPreviewImage] = useState("./camera.png");
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const dispatch = useDispatch();

  const {
    success,
    error,
    successUpdate,
    errorUpdate,
    isLoading: loading,
  } = useSelector((state) => state.userIdentifies);

  //   handle upload image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${t("only_allowed")} JPG, JPEG, and PNG`);
        e.target.value = "";
        return;
      }

      setPreviewImage(URL.createObjectURL(file));
      setProfileData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const [jobTitles, setJobTitles] = useState([]);
  const [companyTypes, setCompanyTypes] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const userData = JSON.parse(sessionStorage.getItem("user3ayin"));
  const token = userData?.token;
  const userType = userData?.user?.type;
  const jobTitle = userData.user.profile?.job_title;
  const [emailNotify, setEmailNotify] = useState("");
  const [hasIdentifiers, setHasIdentifiers] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    image: null,
    job_title_id: null,
    bio: "",
    age: "",
    email: "",
    username: "",
    company_name: "",
    company_type_id: null,
  });
  const [profileResponse, setProfileResponse] = useState(null);

  const [userIdentifiesFields, setUserIdentifiesFields] = useState({
    national_id_number: "",
    personal_photo: "",
    national_id_front: "",
    national_id_back: "",
    engineer_card_front: "",
    engineer_card_back: "",
    tax_number: "",
    company_logo: "",
    tax_record_front: "",
    tax_record_back: "",
    tax_card_front: "",
    tax_card_back: "",
    previews: {},
  });
  const handleInputChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
          toast.error(`${t("only_allowed")} JPG, JPEG, and PNG`);
          e.target.value = "";
          return;
        }

        // create preview
        const previewUrl = URL.createObjectURL(file);

        setUserIdentifiesFields((prev) => ({
          ...prev,
          [name]: file,
          previews: {
            ...prev.previews,
            [name]: previewUrl,
          },
        }));
      }
    } else {
      setUserIdentifiesFields((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // handle user identifies
  const submitUserIdentifies = (e) => {
    e.preventDefault();

    // check required images depending on user type
    if (userType === "individual") {
      let requiredFields = [
        "personal_photo",
        "national_id_front",
        "national_id_back",
      ];

      if (!(jobTitle === "Marketer" || jobTitle === "مسوق")) {
        requiredFields.push("engineer_card_front", "engineer_card_back");
      }

      const missing = requiredFields.filter(
        (field) => !userIdentifiesFields[field]
      );
      if (missing.length > 0) {
        toast.error(t("profile.please_upload_required_images"));
        return;
      }
    } else {
      const requiredFields = [
        "company_logo",
        "tax_record_front",
        "tax_record_back",
        "tax_card_front",
        "tax_card_back",
      ];

      const missing = requiredFields.filter(
        (field) => !userIdentifiesFields[field]
      );
      if (missing.length > 0) {
        toast.error(t("profile.please_upload_required_images"));
        return;
      }
    }

    // build form data if validation passes
    const formData = new FormData();
    formData.append("type", userType);

    if (userType === "individual") {
      formData.append(
        "national_id_number",
        userIdentifiesFields.national_id_number
      );
      formData.append("personal_photo", userIdentifiesFields.personal_photo);
      formData.append(
        "national_id_front",
        userIdentifiesFields.national_id_front
      );
      formData.append(
        "national_id_back",
        userIdentifiesFields.national_id_back
      );
      formData.append(
        "engineer_card_front",
        userIdentifiesFields.engineer_card_front
      );
      formData.append(
        "engineer_card_back",
        userIdentifiesFields.engineer_card_back
      );
    } else {
      formData.append("tax_number", userIdentifiesFields.tax_number);
      formData.append("company_logo", userIdentifiesFields.company_logo);
      formData.append(
        "tax_record_front",
        userIdentifiesFields.tax_record_front
      );
      formData.append("tax_record_back", userIdentifiesFields.tax_record_back);
      formData.append("tax_card_front", userIdentifiesFields.tax_card_front);
      formData.append("tax_card_back", userIdentifiesFields.tax_card_back);
    }

    dispatch(storeUserIdentifies(formData));
  };
  // handle user identifies update
  const userIdentifiesUpdate = (e) => {
    e.preventDefault();

    if (userType === "individual") {
      let requiredFields = [
        "personal_photo",
        "national_id_front",
        "national_id_back",
      ];

      if (!(jobTitle === "Marketer" || jobTitle === "مسوق")) {
        requiredFields.push("engineer_card_front", "engineer_card_back");
      }

      const missing = requiredFields.filter(
        (field) => !userIdentifiesFields[field]
      );
      if (missing.length > 0) {
        toast.error(t("profile.please_upload_required_images"));
        return;
      }
    } else {
      const requiredFields = [
        "company_logo",
        "tax_record_front",
        "tax_record_back",
        "tax_card_front",
        "tax_card_back",
      ];

      const missing = requiredFields.filter(
        (field) => !userIdentifiesFields[field]
      );
      if (missing.length > 0) {
        toast.error(t("profile.please_upload_required_images"));
        return;
      }
    }

    // build form data if validation passes
    const formData = new FormData();
    formData.append("type", userType);

    if (userType === "individual") {
      formData.append(
        "national_id_number",
        userIdentifiesFields.national_id_number
      );
      formData.append("personal_photo", userIdentifiesFields.personal_photo);
      formData.append(
        "national_id_front",
        userIdentifiesFields.national_id_front
      );
      formData.append(
        "national_id_back",
        userIdentifiesFields.national_id_back
      );

      if (!(jobTitle === "Marketer" || jobTitle === "مسوق")) {
        formData.append(
          "engineer_card_front",
          userIdentifiesFields.engineer_card_front
        );
        formData.append(
          "engineer_card_back",
          userIdentifiesFields.engineer_card_back
        );
      }
    } else {
      formData.append("tax_number", userIdentifiesFields.tax_number);
      formData.append("company_logo", userIdentifiesFields.company_logo);
      formData.append(
        "tax_record_front",
        userIdentifiesFields.tax_record_front
      );
      formData.append("tax_record_back", userIdentifiesFields.tax_record_back);
      formData.append("tax_card_front", userIdentifiesFields.tax_card_front);
      formData.append("tax_card_back", userIdentifiesFields.tax_card_back);
    }

    dispatch(updateUserIdentifies(formData));
  };

  // fetch identifiers
  const getUserIdentifiers = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const { data } = await axios.get(
        `https://app.xn--mgb9a0bp.com/api/profile/identifies`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Lang: i18n.language,
          },
        }
      );

      if (data?.code === 200) {
        const identifiers = data.data;

        const isMarketer = jobTitle === "Marketer" || jobTitle === "مسوق";

        setUserIdentifiesFields((prev) => ({
          ...prev,
          national_id_number: identifiers.national_id_number || "",
          personal_photo: identifiers.personal_photo,
          national_id_front: identifiers.national_id_front,
          national_id_back: identifiers.national_id_back,
          // 🧩 Only include engineer cards if not a marketer
          engineer_card_front: !isMarketer
            ? identifiers.engineer_card_front
            : null,
          engineer_card_back: !isMarketer
            ? identifiers.engineer_card_back
            : null,
          tax_number: identifiers.tax_number || "",
          company_logo: identifiers.company_logo,
          tax_record_front: identifiers.tax_record_front,
          tax_record_back: identifiers.tax_record_back,
          tax_card_front: identifiers.tax_card_front,
          tax_card_back: identifiers.tax_card_back,
          previews: {
            personal_photo: identifiers.personal_photo,
            national_id_front: identifiers.national_id_front,
            national_id_back: identifiers.national_id_back,
            // 🧩 Same for previews
            engineer_card_front: !isMarketer
              ? identifiers.engineer_card_front
              : null,
            engineer_card_back: !isMarketer
              ? identifiers.engineer_card_back
              : null,
            company_logo: identifiers.company_logo,
            tax_record_front: identifiers.tax_record_front,
            tax_record_back: identifiers.tax_record_back,
            tax_card_front: identifiers.tax_card_front,
            tax_card_back: identifiers.tax_card_back,
          },
        }));
        setHasIdentifiers(true);
      } else {
        setHasIdentifiers(false);
      }
    } catch (error) {
      console.error("Error fetching identifiers:", error);
    }
  };

  useEffect(() => {
    getUserIdentifiers();
  }, [i18n.language]);
  useEffect(() => {
    if (success) {
      toast.success(t("addedSuccessfully"));
      dispatch(clearState());
    }
    if (error) {
      toast.error(t("failedToAdd"));
      dispatch(clearState());
    }
  }, [success, error]);
  useEffect(() => {
    if (successUpdate) {
      toast.success(t("updatedSuccessfully"));
      dispatch(clearState());
    }
    if (errorUpdate) {
      toast.error(t("failedToUpdate"));
      dispatch(clearState());
    }
  }, [successUpdate, errorUpdate]);

  // fetch job titles & company types
  useEffect(() => {
    fetch("https://app.xn--mgb9a0bp.com/api/job-titles", {
      headers: {
        Lang: i18n.language,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setJobTitles(
          data.data.map((item) => ({
            value: item.id,
            label: item.name,
          }))
        );
      });

    fetch("https://app.xn--mgb9a0bp.com/api/company-types", {
      headers: {
        Lang: i18n.language,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCompanyTypes(
          data.data.map((item) => ({
            value: item.id,
            label: item.name,
          }))
        );
      });
  }, [i18n.language]);

  // handle profile change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const getProfileData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/profileData`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          Lang: i18n.language,
        },
      });

      const user = response.data.data?.user;
      if (!user) return;

      const profile = user.profile || {};

      setProfileResponse(profile);

      setProfileData((prev) => ({
        ...prev,
        name: user?.profile?.name || "",
        age: user?.profile.age || "",
        phone: user?.phone || "",
        bio: user?.bio || "",
        email: user?.email || "",
        image: user?.image || null,
        username: user?.profile?.username || "",
        company_name: user?.profile?.company_name || "",
      }));

      if (user.image) setPreviewImage(user.image);

      if (companyTypes.length) {
        let matchCompany = null;

        if (user?.profile.company_type_id) {
          matchCompany = companyTypes.find(
            (c) => String(c.value) === String(user?.profile.company_type_id)
          );
        } else if (user?.profile.company_type) {
          matchCompany = companyTypes.find(
            (c) => c.label === user?.profile.company_type
          );
        }

        if (matchCompany) {
          setProfileData((prev) => ({
            ...prev,
            company_type_id: matchCompany,
          }));
        }
      }

      if (jobTitles.length) {
        let matchJob = null;

        if (user?.profile.job_title_id) {
          matchJob = jobTitles.find(
            (j) => String(j.value) === String(user?.profile.job_title_id)
          );
        } else if (user?.profile.job_title) {
          matchJob = jobTitles.find(
            (j) => j.label === user?.profile.job_title
          );
        }

        if (matchJob) {
          setProfileData((prev) => ({
            ...prev,
            job_title_id: matchJob,
          }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);
 
  useEffect(() => {
  if (!profileResponse) return;

  if (companyTypes.length && profileResponse.company_type_id) {
    const matchCompany = companyTypes.find(
      (c) => String(c.value) === String(profileResponse.company_type_id)
    );
    if (matchCompany) {
      setProfileData((prev) => ({ ...prev, company_type_id: matchCompany }));
    }
  }

  if (jobTitles.length && profileResponse.job_title_id) {
    const matchJob = jobTitles.find(
      (j) => String(j.value) === String(profileResponse.job_title_id)
    );
    if (matchJob) {
      setProfileData((prev) => ({ ...prev, job_title_id: matchJob }));
    }
  }
}, [jobTitles, companyTypes, profileResponse]);
  // submit update profile
  const handleSubmit = (e) => {
    e.preventDefault();
    
  if (!profileData.phone || profileData.phone.length < 11 || profileData.phone.length > 11) {
    toast.error(t("validation.the_phone_field_must_be_at_least_11_characters"));
    return;
  }
  const formData = new FormData();
    formData.append("phone", profileData.phone);
    formData.append("email", profileData.email);
    formData.append("bio", profileData.bio);

    if (profileData.image && profileData.image instanceof File) {
      formData.append("image", profileData.image);
    }

    if (userType === "company") {
      formData.append("company_name", profileData.company_name);
      formData.append(
        "company_type_id",
        profileData.company_type_id?.value ?? ""
      );
      formData.append("username", profileData.username);
    }

    if (userType === "individual") {
      formData.append("name", profileData.name);
      formData.append("age", profileData.age);
      formData.append("job_title_id", profileData.job_title_id?.value ?? "");
    }

    setIsLoadingUpdate(true);
    axios
      .post(`${BASE_URL}/api/profile/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          Lang: i18n.language,
        },
      })
      .then((res) => {
        toast.success(t("profile.updatedSuccessfully"));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(() => {
        setIsLoadingUpdate(false);
        toast.error(t("profile.updateFailed"));
      })
      .finally(() => {
        setIsLoadingUpdate(false);
      });
  };

  return (
    <>
      <Breadcrumb title={t("profile.title")} />
      <div className="profile py-5 bg_overlay">
        <div className="container position-relative">
          <ul
            className="nav nav-tabs justify-content-center"
            id="myTab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="profile-tab"
                data-bs-toggle="tab"
                data-bs-target="#profile"
                type="button"
                role="tab"
                aria-controls="profile"
                aria-selected="true"
              >
                {t("profile.title")}
              </button>
            </li>
            
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="identityVerification-tab"
                data-bs-toggle="tab"
                data-bs-target="#identityVerification"
                type="button"
                role="tab"
                aria-controls="identityVerification"
                aria-selected="false"
              >
                {t("profile.identityVerification")}
              </button>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active p-3"
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <form className="form-style" onSubmit={handleSubmit}>
                <div className="row">
                  {/* Upload Image */}
                  <div className="col-12">
                    <div className="user_upload_profile">
                      <input
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        name="image"
                        onChange={handleImageChange}
                      />
                      <div className="img">
                        <img
                          src={previewImage || "./camera.png"}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "./camera.png";
                          }}
                          alt="--"
                        />
                      </div>
                      <div className="icon">
                        <i className="bi bi-camera-fill"></i>
                      </div>
                    </div>
                  </div>

                  {userType === "individual" && (
                    <>
                      <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                        <label>{t("profile.name")}</label>
                        <input
                          type="text"
                          required
                          name="name"
                          onChange={handleProfileChange}
                          value={profileData.name}
                          placeholder={t("profile.name")}
                        />
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                        <label>{t("profile.age")}</label>
                        <input
                          type="text"
                          name="age"
                          required
                          onChange={handleProfileChange}
                          value={profileData.age}
                          placeholder={t("profile.age")}
                        />
                      </div>
                    </>
                  )}
                  {userType === "company" && (
                    <>
                      <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                        <label>{t("sign.account_username")}</label>
                        <input
                          type="text"
                          name="username"
                          onChange={handleProfileChange}
                          value={profileData.username}
                          placeholder={t("sign.account_username")}
                        />
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                        <label>{t("sign.company_name")}</label>
                        <input
                          type="text"
                          name="company_name"
                          onChange={handleProfileChange}
                          value={profileData.company_name}
                          required
                          placeholder={t("sign.company_name")}
                        />
                      </div>
                    </>
                  )}

                  {/* Email */}
                  <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                    <label>{t("profile.email")}</label>
                    <input
                      type="text"
                      name="email"
                      disabled
                      readOnly
                      style={{ cursor: "no-drop" }}
                      className="bg-light"
                      value={profileData.email}
                      placeholder={t("profile.email")}
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                    <label>{t("profile.phone")}</label>
                    <input
                      type="number"
                      min="0"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      }}
                      name="phone"
                      required
                      onChange={handleProfileChange}
                      value={profileData.phone}
                      placeholder={t("profile.phone")}
                    />
                  </div>

                  {/* Job Title */}
                  {userType === "individual" && (
                    <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                      <label>{t("profile.jobTitle")}</label>
                      <Select
                        name="job_title_id"
                        value={profileData.job_title_id}
                        onChange={(selected) =>
                          setProfileData((prev) => ({
                            ...prev,
                            job_title_id: selected,
                          }))
                        }
                        required
                        options={jobTitles}
                        classNamePrefix="react-select"
                        placeholder={t("profile.jobTitle")}
                      />
                    </div>
                  )}

                  {/* Company Type */}
                  {userType === "company" && (
                    <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                      <label>{t("sign.company_type")}</label>
                      <Select
                        name="company_type_id"
                        value={profileData.company_type_id}
                        onChange={(selected) =>
                          setProfileData((prev) => ({
                            ...prev,
                            company_type_id: selected,
                          }))
                        }
                        required
                        options={companyTypes}
                        classNamePrefix="react-select"
                        placeholder={t("sign.company_type")}
                      />
                    </div>
                  )}

                  {/* Bio */}
                  <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                    <label>{t("profile.bio")}</label>
                    <textarea
                      name="bio"
                      onChange={handleProfileChange}
                      value={profileData.bio}
                      required
                      placeholder={t("profile.bio")}
                    ></textarea>
                  </div>

                  {/* Submit */}
                  <div className="col-md-12">
                    <button
                      type="submit"
                      disabled={isLoadingUpdate}
                    >
                      {isLoadingUpdate ? (
                        t("loading")
                      ) : (
                        t("profile.save")
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            <div
              className="tab-pane fade p-3"
              id="identityVerification"
              role="tabpanel"
              aria-labelledby="identityVerification-tab"
            >
              <form
                onSubmit={
                  hasIdentifiers ? userIdentifiesUpdate : submitUserIdentifies
                }
              >
                {/* Individual */}
                {userType === "individual" && (
                  <div className="form-style">
                    <label>{t("profile.nationalId")}</label>
                    <input
                      type="text"
                      name="national_id_number"
                      inputMode="numeric"
                      required
                      placeholder={t("profile.nationalId")}
                      onChange={handleInputChange}
                      value={userIdentifiesFields.national_id_number}
                    />

                    <div className="row">
                      {[
                        {
                          name: "personal_photo",
                          label: t("profile.personalPhoto"),
                        },
                        {
                          name: "national_id_front",
                          label: t("profile.idFront"),
                        },
                        {
                          name: "national_id_back",
                          label: t("profile.idBack"),
                        },
                        {
                          name: "engineer_card_front",
                          label: t("profile.engineerCardFront"),
                        },
                        {
                          name: "engineer_card_back",
                          label: t("profile.engineerCardBack"),
                        },
                      ]
                        .filter(
                          (field) =>
                            !(
                              (jobTitle === "Marketer" ||
                                jobTitle === "مسوق") &&
                              (field.name === "engineer_card_front" ||
                                field.name === "engineer_card_back")
                            )
                        )
                        .map((field) => (
                          <div
                            className="col-xl-4 col-lg-4 col-md-6 col-12"
                            key={field.name}
                          >
                            <label>{field.label}</label>
                            <div className="photo_wrapper">
                              <input
                                type="file"
                                accept=".jpg, .jpeg, .png"
                                name={field.name}
                                onChange={handleInputChange}
                              />
                              <img
                                src={
                                  userIdentifiesFields.previews[field.name] ||
                                  "/camera.png"
                                }
                                alt="--"
                              />
                              <span>{t("create_ad.uploadImage")}</span>
                            </div>
                          </div>
                        ))}
                    </div>

                    <button type="submit" disabled={loading}>
                      {loading
                        ? t("loading")
                        : hasIdentifiers
                        ? t("pages.update")
                        : t("pages.helpCenter.send")}
                    </button>
                  </div>
                )}

                {/* Company */}
                {userType === "company" && (
                  <div className="form-style">
                    <label>{t("profile.taxNumber")}</label>
                    <input
                      type="text"
                      required
                      name="tax_number"
                      inputMode="numeric"
                      value={userIdentifiesFields.tax_number}
                      placeholder={t("profile.taxNumber")}
                      onChange={handleInputChange}
                    />
                    <div className="row">
                      {[
                        {
                          name: "company_logo",
                          label: t("profile.companyLogo"),
                        },
                        {
                          name: "tax_record_front",
                          label: t("profile.taxRecordFront"),
                        },
                        {
                          name: "tax_record_back",
                          label: t("profile.taxRecordBack"),
                        },
                        {
                          name: "tax_card_front",
                          label: t("profile.taxCardFront"),
                        },
                        {
                          name: "tax_card_back",
                          label: t("profile.taxCardBack"),
                        },
                      ].map((field, index) => (
                        <div
                          className="col-xl-4 col-lg-4 col-md-6 col-12"
                          key={field.name}
                        >
                          <label>{field.label}</label>
                          <div className="photo_wrapper">
                            <input
                              type="file"
                              accept=".jpg, .jpeg, .png"
                              name={field.name}
                              onChange={handleInputChange}
                            />
                            <img
                              src={
                                userIdentifiesFields.previews[field.name] ||
                                "/camera.png"
                              }
                              alt="--"
                            />
                            <span>{t("create_ad.uploadImage")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="submit" disabled={loading}>
                      {loading
                        ? t("loading")
                        : hasIdentifiers
                        ? t("pages.update")
                        : t("pages.helpCenter.send")}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
