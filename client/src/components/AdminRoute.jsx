import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoutes() {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (email !== "test@admin.com") {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
}