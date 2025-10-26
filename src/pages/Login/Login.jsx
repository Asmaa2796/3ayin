import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearState } from '../../redux/Slices/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const { t } = useTranslation('global');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { isLoading, error,errorCode, user } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
  if (errorCode === 415) {
    toast.warn(t("validation.your_email_not_activated"));

    if (location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }

    return;
  }

  if (error === "The selected email is invalid.") {
    toast.error(t("validation.emailInvalid"));
    dispatch(clearState());
    return;
  }
  if (error === "Invalid email or password") {
    toast.error(t("validation.emailOrPasswordInvalid"));
    dispatch(clearState());
    return;
  }

  if (error) {
    toast.error(t("sign.loginFail"));
    dispatch(clearState());
    return;
  }

  if (user) {
    toast.success(t("sign.loginSuccess"));
    navigate("/", { replace: true });
  }
}, [error, user, errorCode, dispatch, t, navigate, location.pathname]);

  return (
    <div
      className='registration_forms py-4'
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >
      <form onSubmit={handleSubmit}>
        <Link to="/"><img className='logo' src="/logo-white.png" alt="Logo" /></Link>
        
        <h5 className='text-center mt-2 mb-3 fw-bold text-dark'>
          {t("sign.login")}
        </h5>

        <div className='text-sm text-center'>
          <span className='text-dark'>{t("sign.noAccount")}</span>
          <span className='fw-bold mx-1'>
            <a className='main-color' href="/register">{t("sign.createAccount")}</a>
          </span>
        </div>

        <label className='text-dark'>{t("sign.email")}</label>
        <input
          autoComplete='off'
          type="email"
          name="email"
          placeholder={t("sign.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className='text-dark'>{t("sign.password")}</label>
        <input
          autoComplete='off'
          type="password"
          name="password"
          placeholder={t("sign.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className='my-2'>
          <Link className='main-color text-sm fw-bold' to="/change_password">
            {t("sign.forgotPassword")}
          </Link>
        </div>

        <div className='text-center'>
          <button type='submit' disabled={isLoading}>
            {isLoading ? t("sign.loading") : t("sign.login")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
