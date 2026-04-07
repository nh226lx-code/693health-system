import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminRecords from "./pages/AdminRecords";
import AdminRoutes from "./components/AdminRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* 登录 / 注册 */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 用户 */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* 管理员（带权限） */}
      <Route path="/admin" element={<AdminRoutes />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="records" element={<AdminRecords />} />
      </Route>
    </Routes>
  );
}