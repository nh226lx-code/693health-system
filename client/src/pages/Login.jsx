import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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

  const handleRegister = () => {
    if (password !== confirm) {
      alert("两次密码不一致");
      return;
    }
    alert("注册成功");
    setIsLogin(true);
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <h1>健康管理平台</h1>
        <p>
          记录步数、睡眠、饮水与体重，实时分析健康趋势，
          帮助你更科学地管理生活。
        </p>
        <button onClick={() => setIsLogin(false)}>立即开始</button>
      </div>

      <div className="login-card">
        <h2>{isLogin ? "登录系统" : "用户注册"}</h2>

        <input
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {!isLogin && (
          <input
            type="password"
            placeholder="确认密码"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        )}

        <button onClick={isLogin ? handleLogin : handleRegister}>
          {isLogin ? "登录" : "注册"}
        </button>

        <p className="switch-text">
          {isLogin ? "没有账号？" : "已有账号？"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "去注册" : "去登录"}
          </span>
        </p>
      </div>
    </div>
  );
}