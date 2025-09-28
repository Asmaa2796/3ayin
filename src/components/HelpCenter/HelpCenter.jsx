import React, { useEffect, useState } from "react";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import { IoMdTime } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { contactForm, clearState } from "../../redux/Slices/ContactSlice";
import { toast } from "react-toastify";
const HelpCenter = () => {
  const { t, i18n } = useTranslation("global");
  const dispatch = useDispatch();
  const { isLoading, error, success } = useSelector((state) => state.contact);

  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formdata.message.trim()) {
      toast.error(t("the_message_field_is_required"));
      return;
    }
    if (formdata.message.trim().length < 10) {
      toast.error(t("the_message_field_must_be_at_least_10_characters"));
      return;
    }

    dispatch(contactForm(formdata));
  };

  useEffect(() => {
    if (success) {
      toast.success(t("form_submitted_successfully"));
      setformdata({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      dispatch(clearState());
    }

    if (error) {
      // Show detailed backend validation error if available
      if (error?.errors?.message?.length) {
        toast.error(error.errors.message[0]);
      } else {
        toast.error(t("failed_to_submit_form"));
      }
      dispatch(clearState());
    }
  }, [success, error, t, dispatch]);

  return (
    <div className="bg_overlay">
      <Breadcrumb title={t("pages.helpCenter.helpCenter")} />
      <div className="py-5 help_center position-relative">
        <div className="container">
          <div className="row">
            <div className="col-xl-9 col-lg-9 col-md-9 col-12">
              <form className="form-style" onSubmit={handleSubmit}>
                <small>{t("pages.helpCenter.contactUs")}</small>
                <h3 className="fw-bold mb-3">
                  {t("pages.helpCenter.customRequest")}
                </h3>
                <div className="row">
                  {["name", "email", "phone", "subject"].map((field) => (
                    <div className="col-xl-6 col-lg-6 col-md-6 col-12" key={field}>
                      <input
                        required
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        placeholder={t(`pages.helpCenter.${field}`)}
                        value={formdata[field]}
                        onChange={handleChange}
                      />
                    </div>
                  ))}
                  <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                    <textarea
                      name="message"
                      placeholder={t("pages.helpCenter.message")}
                      value={formdata.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                    <button type="submit" disabled={isLoading}>
                      {isLoading
                        ? t("pages.helpCenter.sending")
                        : t("pages.helpCenter.send")}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-12">
              <div className="stay_in_touch">
                <b className="d-block mb-3">
                  {t("pages.helpCenter.stayInTouch")}
                </b>
                <small className="d-block">{t("pages.helpCenter.address")}:</small>
                <p>--</p>
                <small className="d-block my-2">0101010101010</small>
                <small className="d-block my-2">0101010101010</small>
                <small className="d-block fw-bold">
                  <IoMdTime className="text-danger" />{" "}
                  {t("pages.helpCenter.workingHours")}
                </small>
                <p className="line-height text-sm my-2">
                  {i18n.language === "ar"
                    ? " من 10 صباحًا إلى 10 مساءً بتوقيت الساحل الشرقي (EST)، طوال أيام الأسبوع"
                    : "from 10 a.m to 10 p.m Eastern Standard Time (EST), All week days"}
                </p>
              </div>
              <div
                className="text-center fw-bold rounded-3 border my-2 px-5 py-2 text-sm"
                style={{ borderColor: "#ddd" }}
              >
                {t("pages.helpCenter.supportInfo")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
