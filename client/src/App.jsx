import React from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>健康系统首页</h1>
      <Link to="/login">去登录</Link> |{" "}
      <Link to="/register">去注册</Link>
    </div>
  );
}

function Login() {
  return (
    <div style={{ padding: "40px" }}>
      <h2>登录页面</h2>
      <input placeholder="用户名" />
      <br />
      <input placeholder="密码" type="password" />
      <br />
      <button>登录</button>
    </div>
  );
}

function Register() {
  return (
    <div style={{ padding: "40px" }}>
      <h2>注册页面</h2>
      <input placeholder="用户名" />
      <br />
      <input placeholder="密码" type="password" />
      <br />
      <button>注册</button>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </HashRouter>
  );
}