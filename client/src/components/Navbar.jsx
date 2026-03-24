import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#0a3d62",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#fff",
      }}
    >
      {/* 左侧 */}
      <div style={{ fontWeight: "bold", fontSize: "18px" }}>
        健康管理系统
      </div>

      {/* 右侧 */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          首页
        </Link>

        <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>
          登录
        </Link>

        {/* ✅ 注册按钮（关键） */}
        <Link to="/register" style={{ color: "#fff", textDecoration: "none" }}>
          注册
        </Link>

        {/* 管理员才显示 */}
        {role === "admin" && (
          <Link to="/admin" style={{ color: "#fff", textDecoration: "none" }}>
            管理后台
          </Link>
        )}

        {/* 退出 */}
        <button
          onClick={handleLogout}
          style={{
            background: "#e74c3c",
            border: "none",
            color: "#fff",
            padding: "6px 12px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          退出
        </button>
      </div>
    </nav>
  );
}