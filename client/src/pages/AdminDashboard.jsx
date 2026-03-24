import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar.jsx";

export default function AdminDashboard() {
  const [overview, setOverview] = useState({
    totalUsers: 0,
    totalRecords: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOverview = async () => {
  try {
    const res = await API.get("/health");

    setOverview({
      totalUsers: 1,
      totalRecords: res.data.length || 0
    });

  } catch (err) {
    alert("获取数据失败");
  }
};

    fetchOverview();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Topbar />

      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#0f172a" }}>
            管理后台总览
          </h2>
          <p style={{ marginTop: 8, color: "#64748b" }}>
            统一查看平台运行状态、用户数量与健康记录情况
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginBottom: 24
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg,#dbeafe,#eff6ff)",
              borderRadius: 24,
              padding: 24,
              boxShadow: "0 10px 30px rgba(15,23,42,0.06)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ color: "#64748b", fontSize: 14 }}>注册用户总数</span>
              <span style={{ fontSize: 22 }}>👥</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "#2563eb" }}>
              {overview.totalUsers}
            </div>
            <div style={{ marginTop: 10, color: "#64748b", fontSize: 13 }}>
              当前系统中的所有用户
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg,#dcfce7,#f0fdf4)",
              borderRadius: 24,
              padding: 24,
              boxShadow: "0 10px 30px rgba(15,23,42,0.06)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ color: "#64748b", fontSize: 14 }}>健康记录总数</span>
              <span style={{ fontSize: 22 }}>📋</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "#16a34a" }}>
              {overview.totalRecords}
            </div>
            <div style={{ marginTop: 10, color: "#64748b", fontSize: 13 }}>
              所有用户提交的健康数据
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg,#fef3c7,#fffbeb)",
              borderRadius: 24,
              padding: 24,
              boxShadow: "0 10px 30px rgba(15,23,42,0.06)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ color: "#64748b", fontSize: 14 }}>后台管理状态</span>
              <span style={{ fontSize: 22 }}>🛡️</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#d97706" }}>
              正常运行
            </div>
            <div style={{ marginTop: 10, color: "#64748b", fontSize: 13 }}>
              当前管理员权限已启用
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 20
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: 24,
              boxShadow: "0 10px 30px rgba(15,23,42,0.06)"
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 12, color: "#0f172a" }}>
              系统说明
            </h3>
            <p style={{ color: "#64748b", lineHeight: 1.8 }}>
              本后台用于查看平台整体运行情况，并提供对用户数据与健康记录的集中管理能力。
              管理员可以快速进入用户列表与记录管理页面，对系统数据进行统一查看和维护，
              从而保证本项目具备完整的“前台用户使用 + 后台管理员管理”双端结构。
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: 24,
              boxShadow: "0 10px 30px rgba(15,23,42,0.06)"
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 16, color: "#0f172a" }}>
              快捷入口
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <button
                onClick={() => navigate("/admin/users")}
                style={{
                  padding: "14px 16px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 16,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                查看用户列表
              </button>

              <button
                onClick={() => navigate("/admin/records")}
                style={{
                  padding: "14px 16px",
                  background: "#0f172a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 16,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                管理健康记录
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                style={{
                  padding: "14px 16px",
                  background: "#06b6d4",
                  color: "#fff",
                  border: "none",
                  borderRadius: 16,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                返回用户首页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}