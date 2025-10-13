import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import Home from "../pages/Home/Home";
import Navbar from "../pages/Navbar";
import Footer from "../pages/Footer";
import PublishAd from "../components/PublishAd/PublishAd";
import ServicesPage from "../components/ServicesPage/ServicesPage";
import AdsPage from "../components/Ads/AdsPage";
import ServiceDetails from "../components/ServicesPage/ServiceDetails";
import ServiceProvider from "../components/ServiceProvider/ServiceProvider";
import About from "../components/About/About";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import FAQ from "../components/faq/FAQ";
import HelpCenter from "../components/HelpCenter/HelpCenter";
import Profile from "../components/Profile/Profile";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import VerifyEmail from "../pages/Login/VerifyEmail";
import ProtectedRoutes from "../components/ProtectedRoutes/ProtectedRoutes";
import ResendOtp from "../pages/Login/ResendOtp";
import ChangePassword from "../pages/Login/ChangePassword";
import ResetPassword from "../pages/Login/ResetPassword";
import VerifyPasswordOtp from "../pages/Login/VerifyPasswordOtp";
import ResendPasswordOtp from "../pages/Login/ResendPasswordOtp";
import PageScrollProgressBar from "react-page-scroll-progress-bar";
import TermsAndConditions from "../components/TermsAndConditions/TermsAndConditions";
import PrivacyPolicy from "../components/PrivacyPolicy/PrivacyPolicy";
import AddProperty from "../components/Properties/AddProperty";
import AllProperties from "../components/Properties/AllProperties";
import PropertiesARVR from "../components/Properties/PropertiesARVR";
import PropertiesMap from "../components/Properties/PropertiesMap";
import Packages from "../components/Packages/Packages";
import NotFound from "../pages/NotFound";
import PropertyDetails from "../components/Properties/PropertyDetails";

export default function Applayout() {
  const location = useLocation();
  const { i18n } = useTranslation();

  // Handle direction change based on language
  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
  }, [i18n.language]);

  const hideNavbarFooterPaths = [
    "/login",
    "/register",
    "/verify_email",
    "/resend_otp",
    "/forgot-password",
    "/change_password",
    "/reset_password",
    "/verify_password_otp",
    "/resend_password_otp",
    "/404",
    "/packages",
  ];
  const shouldHideNavbarFooter = hideNavbarFooterPaths.includes(
    location.pathname
  );

  return (
    <>
      {!shouldHideNavbarFooter && (
        <PageScrollProgressBar/>
      )}
      {!shouldHideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="publish_ad" element={<PublishAd />} />
        <Route path="add_property" element={<AddProperty />} />
        <Route path="propertyDetails/:id" element={<PropertyDetails />} />
        <Route path="all_properties" element={<AllProperties />} />
        <Route path="properties_AR_VR" element={<PropertiesARVR />} />
        <Route path="properties_map" element={<PropertiesMap />} />
        <Route path="all_services" element={<ServicesPage />} />
        <Route path="all_ads" element={<AdsPage />} />
        <Route path="serviceDetails/:id" element={<ServiceDetails />} />
        <Route path="provider_profile/:id" element={<ServiceProvider />} />
        <Route path="about" element={<About />} />
        <Route path="how_it_works" element={<HowItWorks />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="help_center" element={<HelpCenter />} />
        <Route path="user_profile" element={<Profile />} />
        <Route path="packages" element={<Packages />} />

        <Route path="privacy_policy" element={<PrivacyPolicy />} />
        <Route path="terms_and_conditions" element={<TermsAndConditions />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify_email" element={<VerifyEmail />} />
          <Route path="/change_password" element={<ChangePassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/verify_password_otp" element={<VerifyPasswordOtp />} />
          <Route path="/resend_otp" element={<ResendOtp />} />
          <Route path="/resend_password_otp" element={<ResendPasswordOtp />} />
        </Route>
      </Routes>
      {!shouldHideNavbarFooter && <Footer />}
    </>
  );
}
