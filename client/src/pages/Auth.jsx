import React, { useState } from "react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      alert(`登录成功（演示）\n用户名：${username}`);
    } else {
      alert(`注册成功（演示）\n用户名：${username}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isLogin ? "用户登录" : "用户注册"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button style={styles.button} type="submit">
            {isLogin ? "登录" : "注册"}
          </button>
        </form>

        <p style={styles.text}>
          {isLogin ? "还没有账号？" : "已有账号？"}
          <span style={styles.switch} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " 去注册" : " 去登录"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fa",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "360px",
    padding: "32px",
    borderRadius: "14px",
    background: "#ffffff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  title: {
    marginBottom: "24px",
    fontSize: "28px",
    color: "#1f2937",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: "16px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
  },
  text: {
    marginTop: "18px",
    fontSize: "14px",
    color: "#4b5563",
  },
  switch: {
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "600",
  },
};