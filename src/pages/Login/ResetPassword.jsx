import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearState } from "../../redux/Slices/authSlice";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { t } = useTranslation("global");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { isLoading, error, success } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(t("validation.the_password_field_confirmation_does_not_match"));
      return;
    }
    if (password.length < 6 && confirmPassword.length < 6) {
      toast.error(t("validation.the_password_field_must_be_at_least_6_characters"));
      return;
    }

    dispatch(resetPassword({ email, password, password_confirmation: confirmPassword }));
  };

  useEffect(() => {
    if (error) {
      toast.error(t("validation.failed_to_reset"));
      dispatch(clearState());
    }

    if (success) {
      toast.success(t("validation.password_reset_successfully"), {
        onClose: () => {
          dispatch(clearState());
          navigate("/login", { replace: true });
        },
      });
    }
  }, [error, success, dispatch, navigate, t]);

  return (
    <div
      className="registration_forms py-4"
      style={{ backgroundImage: "url('/new-password-bg.jpg')" }}
    >
      <form onSubmit={handleSubmit}>
        <Link to="/">
          <img className="logo" src="/logo-white.png" alt="Logo" />
        </Link>
        <h5 className="text-center mt-2 mb-3 fw-bold">{t("sign.newPassword")}</h5>
        <span className="text-sm text-center d-block">
          {t("sign.resetPasswordHelp")}
        </span>

        <label>{t("sign.email")}</label>
        <input
          autoComplete="off"
          type="email"
          name="email"
          placeholder={t("sign.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>{t("sign.newPassword")}</label>
        <input
          autoComplete="off"
          type="password"
          name="password"
          placeholder={t("sign.newPassword")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>{t("sign.confirmPassword")}</label>
        <input
          autoComplete="off"
          type="password"
          name="password_confirmation"
          placeholder={t("sign.confirmPassword")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <div className="text-center">
          <button type="submit" disabled={isLoading}>
            {isLoading ? t("sign.loading") : t("sign.changePassword")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
