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
        const res = await API.get("/health");

        setOverview({
          totalUsers: 1,
          totalRecords: res.data.length || 0
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
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Topbar />

      <div style={{ padding: 30 }}>
        {/* 标题（放大） */}
        <h2
          style={{
            fontSize: 36,
            fontWeight: 800,
            marginBottom: 30,
            color: "#0f172a"
          }}
        >
          管理员后台
        </h2>

        {/* 卡片 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20,
            marginBottom: 30
          }}
        >
          <div
            style={{
              background: "#e0f2fe",
              padding: 24,
              borderRadius: 20
            }}
          >
            <div style={{ fontSize: 14, marginBottom: 10 }}>用户总数</div>
            <div style={{ fontSize: 34, fontWeight: 700 }}>
              {overview.totalUsers}
            </div>
          </div>

          <div
            style={{
              background: "#dcfce7",
              padding: 24,
              borderRadius: 20
            }}
          >
            <div style={{ fontSize: 14, marginBottom: 10 }}>记录总数</div>
            <div style={{ fontSize: 34, fontWeight: 700 }}>
              {overview.totalRecords}
            </div>
          </div>

          <div
            style={{
              background: "#fef9c3",
              padding: 24,
              borderRadius: 20
            }}
          >
            <div style={{ fontSize: 14, marginBottom: 10 }}>系统状态</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>正常</div>
          </div>
        </div>

        {/* 操作入口 */}
        <div
          style={{
            display: "flex",
            gap: 20
          }}
        >
          <button
            onClick={() => navigate("/admin/users")}
            style={{
              padding: "14px 20px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              cursor: "pointer"
            }}
          >
            用户管理
          </button>

          <button
            onClick={() => navigate("/admin/records")}
            style={{
              padding: "14px 20px",
              background: "#0f172a",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              cursor: "pointer"
            }}
          >
            记录管理
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "14px 20px",
              background: "#06b6d4",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              cursor: "pointer"
            }}
          >
            返回用户页
          </button>
        </div>
      </div>
    </div>
  );
}