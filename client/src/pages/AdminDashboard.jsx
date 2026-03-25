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
    const fetchData = async () => {
      try {
        const userRes = await API.get("/users");
        const recordRes = await API.get("/health");

        setOverview({
          totalUsers: Array.isArray(userRes.data)
            ? userRes.data.filter(u => u.role !== "admin").length
            : 0,
          totalRecords: Array.isArray(recordRes.data) ? recordRes.data.length : 0
        });
      } catch {
        setOverview({
          totalUsers: 0,
          totalRecords: 0
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ background: "#f5f7fa", paddingBottom: 30 }}>
      <Topbar />

      <div style={{ padding: 30 }}>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 24
          }}
        >
          <div
            style={{
              background: "#dbeafe",
              borderRadius: 20,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center"
            }}
          >
            <div style={{ marginBottom: 10 }}>注册用户总数</div>
            <div style={{ fontSize: 36, fontWeight: 700 }}>
              {overview.totalUsers}
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>
              当前系统中的所有用户
            </div>
          </div>

          <div
            style={{
              background: "#dcfce7",
              borderRadius: 20,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center"
            }}
          >
            <div style={{ marginBottom: 10 }}>健康记录总数</div>
            <div style={{ fontSize: 36, fontWeight: 700 }}>
              {overview.totalRecords}
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>
              所有用户提交的健康数据
            </div>
          </div>

          <div
            style={{
              background: "#fef3c7",
              borderRadius: 20,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center"
            }}
          >
            <div style={{ marginBottom: 10 }}>后台管理状态</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>
              正常运行
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>
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
              borderRadius: 20,
              padding: 24
            }}
          >
            <h3 style={{ marginBottom: 12 }}>系统说明</h3>
            <p style={{ color: "#64748b", lineHeight: 1.8 }}>
              本后台用于查看平台整体运行情况，并提供对用户数据与健康记录的集中管理能力。
              管理员可以快速进入用户列表与记录管理页面，对系统数据进行统一查看和维护，
              从而保证本项目具备完整的前台用户使用与后台管理员管理结构。
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 24
            }}
          >
            <h3 style={{ marginBottom: 16 }}>快捷入口</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <button
                onClick={() => navigate("/admin/users")}
                style={{
                  padding: "14px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12
                }}
              >
                查看用户列表
              </button>

              <button
                onClick={() => navigate("/admin/records")}
                style={{
                  padding: "14px",
                  background: "#0f172a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12
                }}
              >
                管理健康记录
              </button>

              <button
                onClick={() => navigate("/")}
                style={{
                  padding: "14px",
                  background: "#06b6d4",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12
                }}
              >
                返回首页
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}