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

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            padding: "10px 14px",
            minWidth: 220,
            color: "#94a3b8"
          }}
        >
          搜索功能预留
        </div>

        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18
          }}
        >
          🔔
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            padding: "8px 12px"
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: "linear-gradient(135deg,#2563eb,#06b6d4)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700
            }}
          >
            U
          </div>

          <div>
            <div style={{ fontWeight: 600, color: "#0f172a" }}>
              {role === "admin" ? "Administrator" : "User"}
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              {role === "admin" ? "系统管理权限" : "个人健康管理"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}