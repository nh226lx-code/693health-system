import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      navigate("/dashboard");
    } catch {
      alert("登录失败");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#020617,#0f172a)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 80px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 60,
          marginBottom: 50
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <h1 style={{ fontSize: 54, marginBottom: 18 }}>
            健康管理平台
          </h1>

          <p style={{ color: "#94a3b8", marginBottom: 24 }}>
            记录步数、睡眠、饮水与体重，实时分析健康趋势
          </p>

          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "12px 26px",
              background: "#2563eb",
              borderRadius: 12,
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            立即开始
          </button>
        </div>

        <div
          style={{
            width: 380,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 20,
            padding: 28,
            backdropFilter: "blur(18px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.45)"
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: 18 }}>
            登录系统
          </h2>

          <input
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 12,
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              background: "#f8fafc",
              color: "#0f172a"
            }}
          />

          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 14,
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              background: "#f8fafc",
              color: "#0f172a"
            }}
          />

          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: 12,
              background: "#2563eb",
              borderRadius: 10,
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            登录
          </button>
        </div>
      </div>

      <div>
        <h2
          style={{
            textAlign: "center",
            marginBottom: 30,
            fontSize: 32
          }}
        >
          核心功能
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 30
          }}
        >
          {[
            ["📊", "数据可视化"],
            ["📋", "健康记录管理"],
            ["🛡", "管理后台系统"]
          ].map(([icon, title], i) => (
            <div
              key={i}
              style={{
                background: "#0f1c2e",
                padding: "28px 24px",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                gap: 16,
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
              }}
            >
              <div style={{ fontSize: 34 }}>{icon}</div>

              <div>
                <div style={{ fontSize: 22, marginBottom: 6 }}>
                  {title}
                </div>

                <div style={{ fontSize: 13, color: "#94a3b8" }}>
                  专业级健康数据管理体验
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}import React, { useState, useEffect } from "react";
import API from "../services/api";

export default function HealthForm() {
  const [steps, setSteps] = useState(5000);
  const [sleepHours, setSleepHours] = useState(7);
  const [waterIntake, setWaterIntake] = useState(2);
  const [weight, setWeight] = useState(60);
  const [height, setHeight] = useState(170);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common["Authorization"] = token;
    }
  }, []);

  const handleSubmit = async () => {
    try {
      await API.post("/health", {
        steps,
        sleepHours,
        waterIntake,
        weight,
        height
      });
      alert("数据已保存");
    } catch {
      alert("提交失败");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0f2f5",
      padding: 40
    }}>
      <div style={{
        maxWidth: 800,
        margin: "0 auto",
        background: "white",
        borderRadius: 16,
        padding: 30,
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{
          textAlign: "center",
          marginBottom: 30,
          fontSize: 24,
          fontWeight: 600
        }}>
          健康数据录入
        </h2>

        {/* 分区1：基础活动 */}
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ marginBottom: 15 }}>🏃 基础活动</h3>

          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <label>步数（步）</label>
              <select
                style={{ width: "100%", padding: 10, marginTop: 5 }}
                onChange={(e) => setSteps(Number(e.target.value))}
              >
                {[1000,3000,5000,8000,10000,12000].map(v => (
                  <option key={v} value={v}>{v} 步</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label>睡眠（小时）</label>
              <select
                style={{ width: "100%", padding: 10, marginTop: 5 }}
                onChange={(e) => setSleepHours(Number(e.target.value))}
              >
                {[4,5,6,7,8,9].map(v => (
                  <option key={v} value={v}>{v} 小时</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 分区2：身体指标 */}
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ marginBottom: 15 }}>📊 身体指标</h3>

          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <label>体重（kg）</label>
              <select
                style={{ width: "100%", padding: 10, marginTop: 5 }}
                onChange={(e) => setWeight(Number(e.target.value))}
              >
                {[50,55,60,65,70,75,80].map(v => (
                  <option key={v} value={v}>{v} kg</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label>身高（cm）</label>
              <select
                style={{ width: "100%", padding: 10, marginTop: 5 }}
                onChange={(e) => setHeight(Number(e.target.value))}
              >
                {[150,160,170,175,180,185].map(v => (
                  <option key={v} value={v}>{v} cm</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 分区3：饮食 */}
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ marginBottom: 15 }}>💧 饮食</h3>

          <label>饮水量（升）</label>
          <select
            style={{ width: "100%", padding: 10, marginTop: 5 }}
            onChange={(e) => setWaterIntake(Number(e.target.value))}
          >
            {[1,1.5,2,2.5,3].map(v => (
              <option key={v} value={v}>{v} L</option>
            ))}
          </select>
        </div>

        {/* 按钮 */}
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: 12,
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            cursor: "pointer"
          }}
        >
          提交健康数据
        </button>
      </div>
    </div>
  );
}