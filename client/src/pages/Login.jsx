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
        background: "linear-gradient(135deg,#020617,#0f172a,#1e3a8a)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 40
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          background: "#ffffff",
          borderRadius: 28,
          padding: 50,
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* 背景装饰 */}
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -80,
            width: 350,
            height: 350,
            background:
              "radial-gradient(circle,#60a5fa30,#3b82f610,transparent)",
            borderRadius: "50%"
          }}
        />

        {/* 上半部分 */}
        <div
          style={{
            display: "flex",
            gap: 60,
            alignItems: "flex-start" // ✅ 顶部对齐
          }}
        >
          {/* 左 */}
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: 52,
                color: "#1e3a8a", // ✅ 更深蓝
                marginBottom: 18,
                fontWeight: 700
              }}
            >
              健康管理平台
            </h1>

            <p
              style={{
                color: "#475569",
                marginBottom: 20,
                lineHeight: 1.6
              }}
            >
              通过智能数据分析帮助你全面掌控健康状况，
              提供步数、睡眠、饮水与体重的可视化管理。
            </p>

            {/* 小标签 */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["数据分析", "趋势图", "健康建议", "管理系统"].map(
                (t, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#e0f2fe",
                      color: "#0369a1",
                      padding: "6px 12px",
                      borderRadius: 20,
                      fontSize: 12
                    }}
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>

          {/* 登录框 */}
          <div
            style={{
              width: 380,
              background: "#f8fafc",
              borderRadius: 20,
              padding: 30,
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
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
                border: "1px solid #cbd5e1"
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
                marginBottom: 16,
                borderRadius: 10,
                border: "1px solid #cbd5e1"
              }}
            />

            <button
              onClick={handleLogin}
              style={{
                width: "100%",
                padding: 12,
                background:
                  "linear-gradient(135deg,#2563eb,#1d4ed8)",
                borderRadius: 10,
                color: "white",
                border: "none",
                fontWeight: 600
              }}
            >
              登录
            </button>

            <div
              style={{
                marginTop: 14,
                textAlign: "center",
                fontSize: 14,
                color: "#64748b"
              }}
            >
              还没有账号？
              <span
                onClick={() => navigate("/register")}
                style={{
                  color: "#2563eb",
                  marginLeft: 6,
                  cursor: "pointer"
                }}
              >
                立即注册
              </span>
            </div>
          </div>
        </div>

        {/* 核心功能（完全按你图） */}
        <div style={{ marginTop: 50 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 20
            }}
          >
            {[
              ["📊", "数据可视化"],
              ["📋", "健康记录管理"],
              ["🛡️", "管理后台系统"]
            ].map(([icon, title], i) => (
              <div
                key={i}
                style={{
                  background: "#0f172a",
                  color: "white",
                  padding: "26px 28px",
                  borderRadius: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 18
                }}
              >
                <div style={{ fontSize: 34 }}>{icon}</div>

                <div>
                  <div style={{ fontSize: 22, fontWeight: 600 }}>
                    {title}
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      color: "#94a3b8",
                      marginTop: 4
                    }}
                  >
                    专业级健康数据管理体验
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}