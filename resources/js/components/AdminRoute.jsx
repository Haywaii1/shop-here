import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function AdminRoute() {
  const location = useLocation();

  const token = localStorage.getItem("admin_token"); // ✅ FIXED
  let admin = null;

  try {
    admin = JSON.parse(localStorage.getItem("admin")); // ✅ FIXED
  } catch {
    admin = null;
  }

  // 🚫 If no admin session → redirect
  if (!token || !admin) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}