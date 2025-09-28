import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearState, verifyPasswordOtp } from "../../redux/Slices/authSlice";
import { toast } from "react-toastify";

const VerifyPasswordOtp = () => {
  const { t } = useTranslation("global");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  const { isLoading, error, success } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyPasswordOtp({ email, code: confirmationCode }));
  };

  useEffect(() => {
    if (error) {
      toast.error(t("sign.failed_to_verify"));
      dispatch(clearState());
    }

    if (success) {
      toast.success(t("sign.verified_successfully"), {
        onClose: () => navigate("/reset_password", { replace: true }),
      });
      dispatch(clearState());
    }
  }, [error, success, dispatch, t, navigate]);

  return (
    <div
      className="registration_forms py-4"
      style={{ backgroundImage: "url('/verify-email.jpg')" }}
    >
      <form onSubmit={handleSubmit}>
        <Link to="/">
          <img className="logo" src="/logo-white.png" alt="Logo" />
        </Link>
        <h5 className="text-center mt-2 mb-3 fw-bold text-dark">
          {t("sign.emailConfirmation")}
        </h5>
        <span className="text-sm text-center d-block">
          {t("sign.checkEmailAndEnterCode")}
        </span>

        <label className="text-dark">{t("sign.email")}</label>
        <input
          autoComplete="off"
          type="email"
          name="email"
          placeholder={t("sign.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="text-dark">{t("sign.confirmationCode")}</label>
        <input
          autoComplete="off"
          type="text"
          name="code"
          placeholder={t("sign.confirmationCode")}
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          required
        />
        <Link
          to="/resend_password_otp"
          className="resend_code fw-bold text-sm main-color"
        >
          {t("sign.resendConfirmationCode")}
        </Link>
        <div className="text-center">
          <button type="submit" disabled={isLoading}>
            {isLoading ? t("sign.loading") : t("sign.confirm")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyPasswordOtp;