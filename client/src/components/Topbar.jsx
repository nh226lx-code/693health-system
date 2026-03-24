import React from "react";

export default function Topbar() {
  let role = "user";
  try {
    const r = localStorage.getItem("role");
    if (r) role = r;
  } catch {}

  return (
    <div
      style={{
        height: 82,
        padding: "0 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(148,163,184,0.18)",
        position: "sticky",
        top: 0,
        zIndex: 20
      }}
    >
      {/* 左侧 */}
      <div>
        <div
          style={{
            fontSize: 14,
            color: "#64748b",
            marginBottom: 6
          }}
        >
          Welcome back
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#0f172a"
          }}
        >
          {role === "admin" ? "管理员控制台" : "健康数据总览"}
        </div>
      </div>

      {/* 右侧（空，占位用） */}
      <div style={{ width: 40 }}></div>
    </div>
  );
}