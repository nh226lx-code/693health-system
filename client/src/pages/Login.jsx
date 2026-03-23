import React, { useState } from "react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isLogin ? "登录成功（演示）" : "注册成功（演示）");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>{isLogin ? "登录系统" : "用户注册"}</h1>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.button} type="submit">
            {isLogin ? "登录" : "注册"}
          </button>
        </form>

        <p style={styles.text}>
          {isLogin ? "没有账号？" : "已有账号？"}
          <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>
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
    background: "linear-gradient(135deg, #020b2d 0%, #04174d 100%)",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    background: "rgba(24, 34, 68, 0.95)",
    borderRadius: "24px",
    padding: "40px 32px 28px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
  },
  title: {
    color: "#fff",
    fontSize: "34px",
    fontWeight: 800,
    textAlign: "center",
    margin: "0 0 28px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    height: "58px",
    borderRadius: "18px",
    border: "2px solid #cfd5df",
    background: "#f4f5f7",
    padding: "0 22px",
    fontSize: "18px",
    color: "#333",
    marginBottom: "18px",
    outline: "none",
  },
  button: {
    width: "100%",
    height: "58px",
    borderRadius: "18px",
    border: "none",
    background: "#3367e8",
    color: "#fff",
    fontSize: "18px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "6px",
  },
  text: {
    marginTop: "16px",
    textAlign: "center",
    color: "#cfd5df",
    fontSize: "15px",
  },
  link: {
    color: "#7ea2ff",
    cursor: "pointer",
    fontWeight: 700,
  },
};