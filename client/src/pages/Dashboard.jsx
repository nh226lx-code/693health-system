import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar.jsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/health");

      const formatted = res.data.map((item, index) => ({
        index: index + 1,
        steps: item.steps,
        sleep: item.sleepHours,
        water: item.waterIntake,
        weight: item.weight
      }));

      setData(formatted);
    };

    fetchData();
  }, []);

  const latest = data[data.length - 1] || {};

  const cards = [
    {
      label: "今日步数",
      value: latest.steps || "--",
      unit: "步",
      color: "#2563eb",
      bg: "linear-gradient(135deg,#dbeafe,#eff6ff)",
      icon: "👟"
    },
    {
      label: "睡眠时长",
      value: latest.sleep || "--",
      unit: "小时",
      color: "#16a34a",
      bg: "linear-gradient(135deg,#dcfce7,#f0fdf4)",
      icon: "🌙"
    },
    {
      label: "饮水摄入",
      value: latest.water || "--",
      unit: "L",
      color: "#0891b2",
      bg: "linear-gradient(135deg,#cffafe,#ecfeff)",
      icon: "💧"
    },
    {
      label: "当前体重",
      value: latest.weight || "--",
      unit: "kg",
      color: "#ea580c",
      bg: "linear-gradient(135deg,#ffedd5,#fff7ed)",
      icon: "⚖️"
    }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Topbar />

      {/* ✅ 加最大宽度 + 居中（关键修复） */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
        
        {/* ✅ 卡片：自适应，不再挤爆 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginBottom: 24
          }}
        >
          {cards.map((item, i) => (
            <div
              key={i}
              style={{
                background: item.bg,
                borderRadius: 20,
                padding: 20,
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: "#64748b" }}>{item.label}</div>
                <div>{item.icon}</div>
              </div>

              <div style={{ fontSize: 28, fontWeight: 700, color: item.color }}>
                {item.value} {item.unit}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ 图表区域：响应式 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20
          }}
        >
          {/* 左侧大图 */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 20
            }}
          >
            <h3>健康趋势</h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Line dataKey="steps" stroke="#2563eb" />
                <Line dataKey="sleep" stroke="#16a34a" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 右侧 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: 20
              }}
            >
              <h3>快捷操作</h3>

              <button onClick={() => navigate("/form")}>
                + 添加健康数据
              </button>
              <button onClick={() => navigate("/history")}>
                查看历史记录
              </button>
              <button onClick={() => navigate("/stats")}>
                查看图表
              </button>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: 20
              }}
            >
              <h3>体重变化</h3>

              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data}>
                  <CartesianGrid stroke="#eee" />
                  <XAxis dataKey="index" />
                  <YAxis />
                  <Tooltip />
                  <Area dataKey="weight" stroke="#f97316" fill="#fdba74" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}