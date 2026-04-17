import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleRegister = async () => {
  if (!username || !email || !password) {
    alert("请填写完整信息");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        password,
        role: "user"
      })
    });

    const data = await res.json();

    if (data.message === "exist") {
      alert("用户已存在");
      return;
    }

    if (data && data._id) {
      alert("注册成功");
      navigate("/login");
    } else {
      alert("注册失败");
    }
  } catch (err) {
    alert("注册失败");
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
              {["数据分析", "趋势图", "健康建议", "管理系统"].map((t, i) => (
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
              ))}
            </div>
          </div>

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
              注册系统
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
                立即登录
              </span>
            </div>
          </div>
        </div>

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