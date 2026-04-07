import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoutes() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

 
  if (!token) return <Navigate to="/login" />;

  if (role !== "admin") return <Navigate to="/dashboard" />;

  return <Outlet />;
}