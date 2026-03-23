import React, { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", { email, password });
      alert("注册成功");
    } catch {
      alert("注册失败");
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      background: "linear-gradient(135deg,#0f172a,#1e293b)"
    }}>
      {/* 左侧视觉区 */}
      <div style={{
        flex: 1,
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 60
      }}>
        <h1 style={{ fontSize: 42, marginBottom: 20 }}>
          健康管理平台
        </h1>
        <p style={{ fontSize: 18, color: "#cbd5f5" }}>
          创建账号，开始你的健康数据管理之旅。
        </p>
      </div>

      {/* 右侧表单 */}
      <div style={{
        width: 420,
        background: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 40
      }}>
        <h2 style={{ marginBottom: 20 }}>注册账号</h2>

        <input
          style={{ padding: 12, marginBottom: 15, borderRadius: 8, border: "1px solid #ddd" }}
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          style={{ padding: 12, marginBottom: 20, borderRadius: 8, border: "1px solid #ddd" }}
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          style={{
            padding: 12,
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: 600
          }}
        >
          注册
        </button>

        <div style={{ marginTop: 15 }}>
          <Link to="/">已有账号？去登录</Link>
        </div>
      </div>
    </div>
  );
}