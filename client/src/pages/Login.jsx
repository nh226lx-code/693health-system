import React, { useState } from "react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* 标题 */}
        <h1 style={styles.title}>
          {isLogin ? "登录系统" : "用户注册"}
        </h1>

        {/* 输入框 */}
        <input style={styles.input} placeholder="邮箱" />
        <input style={styles.input} placeholder="密码" type="password" />

        {/* 按钮 */}
        <button style={styles.button}>
          {isLogin ? "登录" : "注册"}
        </button>

        {/* 切换 */}
        <p style={styles.text}>
          {isLogin ? "没有账号？" : "已有账号？"}
          <span
            style={styles.link}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? " 去注册" : " 去登录"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #020b2d, #04174d)",
  },
  card: {
    width: "420px",
    padding: "40px 30px",
    borderRadius: "20px",
    background: "rgba(30, 40, 70, 0.95)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
  },
  title: {
    color: "#fff",
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "32px",
    fontWeight: "800",
  },
  input: {
    width: "100%",
    height: "55px",
    marginBottom: "15px",
    borderRadius: "15px",
    border: "none",
    padding: "0 20px",
    background: "#f1f2f5",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    height: "55px",
    borderRadius: "15px",
    border: "none",
    background: "#3367e8",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  text: {
    marginTop: "15px",
    textAlign: "center",
    color: "#ccc",
  },
  link: {
    color: "#4a6cf7",
    cursor: "pointer",
    fontWeight: "bold",
  },
};