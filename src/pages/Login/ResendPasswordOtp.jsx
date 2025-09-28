import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resendPasswordOtp, clearState } from "../../redux/Slices/authSlice";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const ResendPasswordOtp = () => {
  const { t } = useTranslation("global");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailOtp, setEmailOtp] = useState("");

  const { isLoadingOtp, successResendPasswordOtp, error } = useSelector((state) => state.auth);

  const handleResendOtp = (e) => {
    e.preventDefault();
    dispatch(resendPasswordOtp({ email: emailOtp }));
  };

  useEffect(() => {
    if (error) {
      toast.error(t("sign.failed_to_resend"));
      dispatch(clearState());
    }

    if (successResendPasswordOtp) {
      toast.success(t("sign.OTP_resent"), {
        onClose: () => {
          navigate("/verify_password_otp",{replace:true});
        },
      });
    }
  }, [error, successResendPasswordOtp, dispatch, t, navigate]);

  return (
    <div className="registration_forms py-4" style={{ backgroundImage: "url('/verify-email.jpg')" }}>
      <form onSubmit={handleResendOtp}>
        <Link to="/">
          <img className="logo" src="/logo-white.png" alt="Logo" />
        </Link>
        <label className="text-dark">{t("sign.email")}</label>
        <input
          autoComplete="off"
          type="email"
          name="email"
          placeholder="example@gmail.com"
          value={emailOtp}
          onChange={(e) => setEmailOtp(e.target.value)}
          required
        />

        <div className="text-center">
          <button type="submit" disabled={isLoadingOtp}>
            {isLoadingOtp
              ? t("sign.loading")
              : t("sign.resendConfirmationCode")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResendPasswordOtp;
