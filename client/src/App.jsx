import React from "react";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>首页 OK</h1>} />
      <Route path="/register" element={<h1>注册页 OK</h1>} />
      <Route path="/login" element={<h1>登录页 OK</h1>} />
    </Routes>
  );
}