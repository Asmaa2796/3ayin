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
  const [previewImage, setPreviewImage] = useState("/user.webp");
  const dispatch = useDispatch();
 
  const { success, error,successUpdate,errorUpdate,isLoading:loading } = useSelector((state) => state.userIdentifies);

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

  // fill update form from sessionStorage
  useEffect(() => {
    if (userData?.user) {
      setProfileData((prev) => ({
        ...prev,
        name: userData.user.profile?.name || "",
        age: userData.user.profile?.age || "",
        phone: userData.user.phone || "",
        bio: userData.user.bio || "",
        email: userData.user.email || "",
        image: userData.user.profile.image || null,
        username: userData.user.profile?.username || "",
        company_name: userData.user.profile?.company_name || "",
      }));

      // set image preview
      if (userData.user?.profile?.image) {
        setPreviewImage(userData.user?.profile?.image);
      }
    }
  }, [i18n.language]);
  // handle notify email
  const notifyEmail = async (e) => {
    e.preventDefault();
    if (!emailNotify) {
      toast.error(t("profile.please_enter_valid_email"));
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/profile/email/notify`,
        { email: emailNotify },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(t("profile.emailUpdated"));
      setEmailNotify("");
    } catch (error) {
      toast.error(t("profile.emailUpdateFailed"));
    }
  };
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
      const requiredFields = [
        "personal_photo",
        "national_id_front",
        "national_id_back",
        "engineer_card_front",
        "engineer_card_back",
      ];

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

    // check required images depending on user type
    if (userType === "individual") {
      const requiredFields = [
        "personal_photo",
        "national_id_front",
        "national_id_back",
        "engineer_card_front",
        "engineer_card_back",
      ];

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

    dispatch(updateUserIdentifies(formData));
  };

  // fetch identifiers
  const getUserIdentifiers = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem("user3ayin"))?.token;
      const { data } = await axios.get(
        `https://3ayin.resporthub.com/api/profile/identifies`,
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

        
        setUserIdentifiesFields((prev) => ({
          ...prev,
          national_id_number: identifiers.national_id_number || "",
          personal_photo: identifiers.personal_photo,
          national_id_front: identifiers.national_id_front,
          national_id_back: identifiers.national_id_back,
          engineer_card_front: identifiers.engineer_card_front,
          engineer_card_back: identifiers.engineer_card_back,
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
            engineer_card_front: identifiers.engineer_card_front,
            engineer_card_back: identifiers.engineer_card_back,
            company_logo: identifiers.company_logo,
            tax_record_front: identifiers.tax_record_front,
            tax_record_back: identifiers.tax_record_back,
            tax_card_front: identifiers.tax_card_front,
            tax_card_back: identifiers.tax_card_back,
          },
        }));
        setHasIdentifiers(true);
      }
      else {setHasIdentifiers(false);}
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
    fetch("https://3ayin.resporthub.com/api/job-titles", {
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

    fetch("https://3ayin.resporthub.com/api/company-types", {
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
  useEffect(() => {
    if (companyTypes.length && userData?.user?.profile?.company_type_id) {
      const match = companyTypes.find(
        (c) => c.value === userData.user.profile.company_type_id
      );
      if (match) {
        setProfileData((prev) => ({ ...prev, company_type_id: match }));
      }
    }
  }, [companyTypes, i18n.language]);

  useEffect(() => {
    if (jobTitles.length && userData?.user?.profile?.job_title_id) {
      const match = jobTitles.find(
        (j) => j.value === userData.user.profile.job_title_id
      );
      if (match) {
        setProfileData((prev) => ({ ...prev, job_title_id: match }));
      }
    }
  }, [jobTitles, i18n.language]);

  useEffect(() => {
    // Run this whenever language, jobTitles or companyTypes change
    if (!jobTitles.length || !companyTypes.length) return;

    const existing = JSON.parse(sessionStorage.getItem("user3ayin")) || {};
    if (!existing.user || !existing.user.profile) return;

    let updated = false;

    // Update job_title label in sessionStorage according to current language
    if (existing.user.profile.job_title_id) {
      const matchedJobTitle = jobTitles.find(
        (jt) => jt.value === existing.user.profile.job_title_id
      );
      if (
        matchedJobTitle &&
        existing.user.profile.job_title !== matchedJobTitle.label
      ) {
        existing.user.profile.job_title = matchedJobTitle.label;
        updated = true;
      }
    }

    // Update company_type label in sessionStorage according to current language
    if (existing.user.profile.company_type_id) {
      const matchedCompanyType = companyTypes.find(
        (ct) => ct.value === existing.user.profile.company_type_id
      );
      if (
        matchedCompanyType &&
        existing.user.profile.company_type !== matchedCompanyType.label
      ) {
        existing.user.profile.company_type = matchedCompanyType.label;
        updated = true;
      }
    }

    if (updated) {
      sessionStorage.setItem("user3ayin", JSON.stringify(existing));
    }

    // Optionally, also update your profileData state with these labels so the UI updates immediately
    if (updated) {
      setProfileData((prev) => ({
        ...prev,
        job_title_id:
          jobTitles.find(
            (jt) => jt.value === existing.user.profile.job_title_id
          ) || prev.job_title_id,
        company_type_id:
          companyTypes.find(
            (ct) => ct.value === existing.user.profile.company_type_id
          ) || prev.company_type_id,
      }));
    }
  }, [i18n.language, jobTitles, companyTypes]);

  // handle profile change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // submit update profile
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("phone", profileData.phone);
    formData.append("email", profileData.email);
    formData.append("bio", profileData.bio);

    if (profileData.image) {
      formData.append("image", profileData.image);
    }

    if (userType === "company") {
      formData.append("company_name", profileData.company_name);

      formData.append(
        "company_type_id",
        profileData.company_type_id?.value ??
          userData.user.profile?.company_type_id
      );

      formData.append("username", profileData.username);
    }

    if (userType === "individual") {
      formData.append("name", profileData.name);
      formData.append("age", profileData.age);

      formData.append(
        "job_title_id",
        profileData.job_title_id?.value ?? userData.user.profile?.job_title_id
      );
    }

    axios
      .post(`${BASE_URL}/api/profile/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          Lang: i18n.language,
        },
      })
      .then((res) => {
        // build updatedUser either from server response or from profileData
        const existing = JSON.parse(sessionStorage.getItem("user3ayin")) || {};
        const updatedUser = {
          ...existing,
          user: {
            ...existing.user,
            phone: profileData.phone,
            bio: profileData.bio,
            profile: {
              ...existing.user?.profile,
              name: profileData.name,
              username: profileData.username,
              age: profileData.age,
              company_name: profileData.company_name,
              image: profileData.image,
              company_type: profileData.company_type_id?.label,
              job_title_id: profileData.job_title_id?.label,
              company_type_id:
                profileData.company_type_id?.value ??
                existing.user.profile?.company_type_id,
              job_title_id:
                profileData.job_title_id?.value ??
                existing.user.profile?.job_title_id,
            },
          },
        };
        sessionStorage.setItem("user3ayin", JSON.stringify(updatedUser));

        window.dispatchEvent(
          new CustomEvent("userUpdated", { detail: updatedUser })
        );

        toast.success(t("profile.updatedSuccessfully"));
      })

      .catch(() => {
        toast.error(t("profile.updateFailed"));
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
                id="notifications-tab"
                data-bs-toggle="tab"
                data-bs-target="#notifications"
                type="button"
                role="tab"
                aria-controls="notifications"
                aria-selected="false"
              >
                {t("profile.notifications")}
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
                          placeholder={t("profile.company_name")}
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
                      type="text"
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
                    <button type="submit">{t("profile.save")}</button>
                  </div>
                </div>
              </form>
            </div>
            <div
              className="tab-pane fade p-3"
              id="notifications"
              role="tabpanel"
              aria-labelledby="notifications-tab"
            >
              <form className="form-style" onSubmit={notifyEmail}>
                <label>{t("profile.emailNotifications")}</label>
                <input
                  type="text"
                  placeholder="example@gmail.com"
                  name="email"
                  value={emailNotify}
                  onChange={(e) => setEmailNotify(e.target.value)}
                />
                <label
                  htmlFor="sendSpecialOffers"
                  className="sendSpecialOffers"
                >
                  <input id="sendSpecialOffers" type="checkbox" />
                  <span className="mx-2">{t("profile.sendSpecialOffers")}</span>
                </label>
                <button type="submit">{t("profile.save")}</button>
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

                {/* Company */}
                {userType === "company" && (
                  <div className="form-style">
                    <label>{t("profile.taxNumber")}</label>
                    <input
                      type="text"
                      required
                      name="tax_number"
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
