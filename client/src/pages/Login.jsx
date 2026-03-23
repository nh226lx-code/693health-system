import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

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
        height: "100vh",
        background: "linear-gradient(135deg,#020617,#0f172a)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 80px",
        boxSizing: "border-box"
      }}
    >
      {/* 主内容 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 60,
          marginBottom: 40
        }}
      >
        {/* 左侧 */}
        <div style={{ maxWidth: 520 }}>
          <h1
            style={{
              fontSize: 54,
              fontWeight: 700,
              marginBottom: 18,
              lineHeight: 1.15
            }}
          >
            健康管理平台
          </h1>

          <p
            style={{
              fontSize: 17,
              color: "#94a3b8",
              lineHeight: 1.6,
              marginBottom: 24
            }}
          >
            记录步数、睡眠、饮水与体重，实时分析健康趋势，
            帮助你更科学地管理生活。
          </p>

          <button
            onClick={() => setIsLogin(false)}
            style={{
              padding: "11px 24px",
              background: "#2563eb",
              border: "none",
              borderRadius: 10,
              color: "white",
              fontWeight: 600
            }}
          >
            立即开始
          </button>
        </div>

        {/* 右侧卡片 */}
        <div
          style={{
            width: 380,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 20,
            padding: 26,
            backdropFilter: "blur(18px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.45)"
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: 16,
              fontSize: 24,
              fontWeight: 600
            }}
          >
            {isLogin ? "登录系统" : "用户注册"}
          </h2>

          <input
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 12,
              marginBottom: 10,
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
              boxSizing: "border-box",
              padding: 12,
              marginBottom: 10,
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              background: "#f8fafc",
              color: "#0f172a"
            }}
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="确认密码"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: 12,
                marginBottom: 12,
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                color: "#0f172a"
              }}
            />
          )}

          <button
            onClick={isLogin ? handleLogin : () => alert("注册成功（演示）")}
            style={{
              width: "100%",
              padding: 11,
              background: "#2563eb",
              border: "none",
              borderRadius: 10,
              color: "white",
              fontWeight: 600
            }}
          >
            {isLogin ? "登录" : "注册"}
          </button>

          <p style={{ marginTop: 12, textAlign: "center", color: "#94a3b8" }}>
            {isLogin ? "没有账号？" : "已有账号？"}
            <span
              onClick={() => setIsLogin(!isLogin)}
              style={{ color: "#2563eb", cursor: "pointer", marginLeft: 6 }}
            >
              {isLogin ? "去注册" : "去登录"}
            </span>
          </p>
        </div>
      </div>

      {/* 底部功能 */}
      <div>
        <h2
          style={{
            textAlign: "center",
            marginBottom: 18,
            fontSize: 32,
            fontWeight: 700
          }}
        >
          核心功能
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20
          }}
        >
          {[
            ["📊", "数据可视化", "专业级健康数据管理体验"],
            ["📋", "健康记录管理", "专业级健康数据管理体验"],
            ["🛡", "管理后台系统", "专业级健康数据管理体验"]
          ].map(([icon, title, desc], i) => (
            <div
              key={i}
              style={{
                background: "#0f172a",
                padding: "20px 18px",
                borderRadius: 16,
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>{icon}</div>

              <div
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  marginBottom: 6
                }}
              >
                {title}
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#94a3b8",
                  lineHeight: 1.5
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}