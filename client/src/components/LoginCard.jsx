import React, { useState } from "react";
import "./LoginCard.css";

export default function LoginCard() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="login-card">
      <h1>{isLogin ? "登录系统" : "用户注册"}</h1>

      <input type="text" placeholder="邮箱" />
      <input type="password" placeholder="密码" />

      <button>
        {isLogin ? "登录" : "注册"}
      </button>

      <p className="switch-text">
        {isLogin ? "没有账号？" : "已有账号？"}
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "去注册" : "去登录"}
        </span>
      </p>
    </div>
  );
}