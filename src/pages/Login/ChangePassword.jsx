import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, clearState } from "../../redux/Slices/authSlice";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const { t } = useTranslation("global");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const { isLoading, success, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(changePassword({ email }));
  };

  useEffect(() => {
    if (error) {
      toast.error(t("validation.failedVerified"));
      dispatch(clearState());
    }
    if (success) {
      toast.success(t("validation.emailVerified"), {
        onClose: () => navigate("/verify_password_otp", { replace: true }),
      });
      dispatch(clearState());
    }
  }, [success, error, dispatch, navigate, t]);

  return (
    <div
      className="registration_forms py-4"
      style={{ backgroundImage: "url('/change-password-bg.jpg')" }}
    >
      <form onSubmit={handleSubmit}>
        <Link to="/">
          <img className="logo" src="/logo-white.png" alt="--" />
        </Link>
        <h5 className="text-center mt-2 mb-3 fw-bold text-dark">
          {t("sign.resetPassword")}
        </h5>
        <span className="text-sm text-center d-block text-dark">
          {t("sign.weWillHelpYouReset")}
        </span>
        <label className="text-dark">{t("sign.email")}</label>
        <input
          autoComplete="off"
          type="text"
          name="email"
          placeholder={t("sign.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Link to="/login" className="resend_code fw-bold text-sm main-color">
          {t("sign.rememberPassword")}
        </Link>
        <div className="text-center">
          <button type="submit" disabled={isLoading}>
            {isLoading ? t("sign.loading") : t("sign.reset")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
