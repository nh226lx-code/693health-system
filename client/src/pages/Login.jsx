import React, { useState } from "react";
import "./Home.css"; // 如果你原来有样式就保留

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      alert("登录成功（演示）");
    } else {
      alert("注册成功（演示）");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* 标题切换 */}
        <h1>{isLogin ? "登录系统" : "用户注册"}</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
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

          {/* 按钮切换 */}
          <button type="submit">
            {isLogin ? "登录" : "注册"}
          </button>
        </form>

        {/* 切换文字 */}
        <p style={{ marginTop: "15px", color: "#ccc" }}>
          {isLogin ? "没有账号？" : "已有账号？"}
          <span
            style={{
              color: "#4a6cf7",
              cursor: "pointer",
              marginLeft: "6px"
            }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "去注册" : "去登录"}
          </span>
        </p>
      </div>
    </div>
  );
}