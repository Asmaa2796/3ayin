import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { clearState, registerUser } from "../../redux/Slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { t, i18n } = useTranslation("global");
  const [tab, setTab] = useState("individual");
  const [jobTitles, setJobTitles] = useState([]);
  const [companyTypes, setCompanyTypes] = useState([]);
  const navigate = useNavigate();
  const { isLoading, error, new_user, validationErrors } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    national_id: "",
    password: "",
    password_confirmation: "",
    bio: "",
    company_type: null,
    company_name: "",
    username: "",
    job_title: null,
  });

  useEffect(() => {
  const lang = i18n.language;

  fetch("https://3ayin.resporthub.com/api/job-titles", {
    headers: {
      Lang: lang,
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
      Lang: lang,
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


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      type: tab,
      email: formData.email,
      phone: formData.phone,
      national_id: formData.national_id,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      bio: formData.bio,
      ...(tab === "individual"
        ? {
            name: formData.name,
            age: formData.age,
            job_title_id: formData.job_title?.value,
          }
        : {
            company_name: formData.company_name,
            username: formData.username,
            company_type_id: formData.company_type?.value,
          }),
    };
    dispatch(registerUser(payload));
  };

  useEffect(() => {
    if (new_user) {
      sessionStorage.setItem("new_user_3ayin", JSON.stringify(new_user));
      toast.success(t("sign.registrationSuccessful"));
      navigate("/verify_email", { replace: true });
    }
  }, [new_user, t, navigate]);

  useEffect(() => {
    if (!validationErrors) return;

    const errorMap = {
      email: "validation.the_email_has_already_been_taken",
      username: "validation.the_username_has_already_been_taken",
      age: "validation.the_age_field_must_be_at_least_16",
      phone: "validation.the_phone_has_already_been_taken",
      name: "validation.the_name_field_is_required",
      national_id: "validation.the_national_id_has_already_been_taken",
      bio: "validation.the_bio_field_must_be_at_least_10_characters",
      password: "validation.the_password_field_must_be_at_least_6_characters",
      password_confirmation:
        "validation.the_password_field_confirmation_does_not_match",
    };

    Object.entries(errorMap).forEach(([field, translationKey]) => {
      if (validationErrors[field]) {
        validationErrors[field].forEach(() => toast.error(t(translationKey)));
      }
    });
    dispatch(clearState());
  }, [validationErrors, t, i18n.language]);

  return (
    <div
      className="registration_forms h-auto py-4"
      style={{ backgroundImage: "url('/register-bg.jpg')" }}
    >
      <div className="register_div">
        <div className="container">
          <Link to="/">
            <img className="logo mb-4" src="/logo-white.png" alt="logo" />
          </Link>

          {/* Segmented Tabs */}
          <div className="flight-types">
            <input
              type="radio"
              id="individual"
              name="register-tab"
              checked={tab === "individual"}
              onChange={() => setTab("individual")}
              className="hidden"
            />
            <label htmlFor="individual">{t("sign.individual")}</label>

            <input
              type="radio"
              id="company"
              name="register-tab"
              checked={tab === "company"}
              onChange={() => setTab("company")}
              className="hidden"
            />
            <label htmlFor="company">{t("sign.company")}</label>

            <div className="slider"></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              {tab === "individual" ? (
                <>
                  <div className="col-md-6">
                    <label className="text-dark">{t("profile.name")}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("profile.name")}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="text-dark">{t("profile.age")}</label>
                    <input
                      type="text"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      placeholder={t(
                        "validation.the_age_field_must_be_at_least_16"
                      )}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-md-6">
                    <label className="text-dark">
                      {t("sign.company_name")}
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                      placeholder={t("sign.company_name")}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="text-dark">
                      {t("sign.account_username")}
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder={t("sign.account_username")}
                    />
                  </div>
                </>
              )}

              <div className="col-md-6">
                <label className="text-dark">{t("profile.email")}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@gmail.com"
                />
              </div>

              <div className="col-md-6">
                <label className="text-dark">{t("profile.phone")}</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder={t(
                    "validation.the_phone_field_must_be_at_least_11_characters"
                  )}
                />
              </div>

              {tab === "individual" ? (
                <div className="col-md-6">
                  <label className="text-dark">{t("profile.jobTitle")}</label>
                  <Select
                    name="job_title"
                    value={formData.job_title}
                    onChange={(value) => handleSelectChange("job_title", value)}
                    classNamePrefix="react-select"
                    options={jobTitles}
                    required
                    placeholder={t("profile.jobTitle")}
                  />
                </div>
              ) : (
                <div className="col-md-6">
                  <label className="text-dark">{t("sign.company_type")}</label>
                  <Select
                    name="company_type"
                    value={formData.company_type}
                    onChange={(value) =>
                      handleSelectChange("company_type", value)
                    }
                    classNamePrefix="react-select"
                    options={companyTypes}
                    required
                    placeholder={t("sign.company_type")}
                  />
                </div>
              )}

              <div className="col-md-6">
                <label className="text-dark">{t("profile.nationalId")}</label>
                <input
                  type="text"
                  name="national_id"
                  value={formData.national_id}
                  onChange={handleChange}
                  required
                  placeholder={t(
                    "validation.the_national_id_field_must_be_at_least_14_characters"
                  )}
                />
              </div>

              <div className="col-md-6">
                <label className="text-dark">{t("sign.password")}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  placeholder={t("sign.password")}
                />
              </div>

              <div className="col-md-6">
                <label className="text-dark">{t("sign.confirmPassword")}</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  placeholder={t("sign.confirmPassword")}
                />
              </div>

              <div className="col-12">
                <label className="text-dark">{t("profile.bio")}</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  placeholder={t(
                    "validation.the_bio_field_must_be_at_least_10_characters"
                  )}
                ></textarea>
              </div>
            </div>

            <div className="text-center">
              <button type="submit" disabled={isLoading}>
                {isLoading ? t("sign.loading") : t("sign.register")}
              </button>
            </div>
            <div className="text-sm text-center my-3">
              <span className="text-dark">{t("sign.haveAccount")}</span>
              <span className="fw-bold mx-1">
                <Link className="main-color" to="/login">
                  {t("sign.login")}
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
