import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Auth from "./pages/Auth";

function Home() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>健康系统首页</h1>
      <div style={{ marginTop: "20px" }}>
        <Link to="/login" style={{ marginRight: "16px" }}>
          去登录
        </Link>
        <Link to="/register">去注册</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
    </Routes>
  );
}