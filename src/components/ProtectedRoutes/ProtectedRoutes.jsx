import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const user = JSON.parse(sessionStorage.getItem("user3ayin"));
  const new_user = JSON.parse(sessionStorage.getItem("new_user_3ayin"));
  const location = useLocation();

  // Pages that shouldn't be accessed by authenticated users
  const authPathsForLoggedUsers = [
    "/login",
    "/register",
    "/verify_email",
    "/resend_otp",
    "/resend_password_otp",
    "/change_password",
    "/reset_password",
    "/verify_password_otp",
  ];

  if (user && authPathsForLoggedUsers.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  const protectedRegisterPaths = ["/verify_email", "/resend_otp"];
  if (!user && !new_user && protectedRegisterPaths.includes(location.pathname)) {
    return <Navigate to="/register" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
