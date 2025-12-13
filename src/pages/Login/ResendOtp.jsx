import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resendOtp, clearState } from "../../redux/Slices/authSlice";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const ResendOtp = () => {
  const { t } = useTranslation("global");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailOtp, setEmailOtp] = useState("");

  const { isLoadingOtp, successResendOtp, error } = useSelector((state) => state.auth);

  const handleResendOtp = (e) => {
    e.preventDefault();
    dispatch(resendOtp({ email: emailOtp }));
  };

  useEffect(() => {
    if (error) {
      const msg = error?.message || error || "";

      if (msg === "The selected email is invalid.") {
        toast.error(t("validation.emailInvalid"));
      } else {
        toast.error(t("sign.failed_to_resend"));
      }

      dispatch(clearState());
    }

    if (successResendOtp) {
      toast.success(t("sign.OTP_resent"), {
        onClose: () => {
          // Save the email to sessionStorage as "new_user_3ayin"
          sessionStorage.setItem("new_user_3ayin", JSON.stringify({ email: emailOtp }));
          navigate("/verify_email",{replace:true});
        },
      });
    }
  }, [error, successResendOtp, dispatch, t, navigate]);

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

export default ResendOtp;
