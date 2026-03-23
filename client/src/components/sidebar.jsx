import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const menu = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/health", label: "录入数据", icon: "📝" },
    { path: "/history", label: "历史记录", icon: "🕘" },
    { path: "/chart", label: "趋势分析", icon: "📈" }
  ];

  if (role === "admin") {
    menu.push({ path: "/admin", label: "管理后台", icon: "🛠" });
  }

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside
      style={{
        width: 250,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        color: "#fff",
        padding: "28px 18px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "6px 0 24px rgba(15, 23, 42, 0.18)"
      }}
    >
      <div>
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.65)",
              letterSpacing: 1.2,
              marginBottom: 8
            }}
          >
            HEALTH SYSTEM
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>
            健康管理平台
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {menu.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  padding: "14px 16px",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: active
                    ? "rgba(255,255,255,0.16)"
                    : "transparent",
                  border: active
                    ? "1px solid rgba(255,255,255,0.18)"
                    : "1px solid transparent",
                  backdropFilter: active ? "blur(8px)" : "none",
                  fontWeight: active ? 600 : 500,
                  transition: "all 0.2s ease"
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 16,
          border: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
          当前角色
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, margin: "6px 0 14px" }}>
          {role === "admin" ? "管理员" : "普通用户"}
        </div>

        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "11px 14px",
            border: "none",
            borderRadius: 12,
            background: "#3b82f6",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          退出登录
        </button>
      </div>
    </aside>
  );
}