import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!username || !email || !password) {
      alert("请填写完整信息");
      return;
    }

    alert("注册成功，请登录");
    navigate("/login");
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

        <div
          style={{
            display: "flex",
            gap: 60,
            alignItems: "flex-start"
          }}
        >
          {/* 左侧内容（完全一样） */}
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: 52,
                color: "#1e3a8a",
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

          {/* 注册框（只改这里） */}
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
              用户注册
            </h2>

            <input
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 12,
                borderRadius: 10,
                border: "1px solid #cbd5e1"
              }}
            />

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
              onClick={handleRegister}
              style={{
                width: "100%",
                padding: 12,
                background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                borderRadius: 10,
                color: "white",
                border: "none",
                fontWeight: 600
              }}
            >
              注册
            </button>

            <div
              style={{
                marginTop: 14,
                textAlign: "center",
                fontSize: 14,
                color: "#64748b"
              }}
            >
              已有账号？
              <span
                onClick={() => navigate("/login")}
                style={{
                  color: "#2563eb",
                  marginLeft: 6,
                  cursor: "pointer"
                }}
              >
                去登录
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}