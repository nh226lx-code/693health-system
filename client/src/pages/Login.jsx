import React, { useState } from "react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={styles.page}>
      {/* 左侧内容（你原来的介绍区） */}
      <div style={styles.left}>
        <h1 style={styles.mainTitle}>健康管理平台</h1>
        <p style={styles.desc}>
          记录步数、睡眠、饮水与体重，实时分析健康趋势，
          帮助你更科学地管理生活。
        </p>

        <button style={styles.registerBtn}>
          免费注册
        </button>
      </div>

      {/* 右侧登录卡片 */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          {isLogin ? "登录系统" : "用户注册"}
        </h2>

        <input style={styles.input} placeholder="邮箱" />
        <input style={styles.input} placeholder="密码" type="password" />

        <button style={styles.button}>
          {isLogin ? "登录" : "注册"}
        </button>

        {/* 切换 */}
        <p style={styles.switch}>
          {isLogin ? "没有账号？" : "已有账号？"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "去注册" : "去登录"}
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 80px",
    background: "linear-gradient(135deg, #020b2d, #04174d)",
  },

  left: {
    maxWidth: "500px",
  },

  mainTitle: {
    fontSize: "56px",
    color: "#fff",
    fontWeight: "800",
    marginBottom: "20px",
  },

  desc: {
    color: "#9aa4c2",
    fontSize: "18px",
    lineHeight: "1.6",
    marginBottom: "30px",
  },

  registerBtn: {
    background: "#3367e8",
    color: "#fff",
    border: "none",
    padding: "14px 28px",
    borderRadius: "12px",
    fontSize: "16px",
    cursor: "pointer",
  },

  card: {
    width: "420px",
    padding: "40px 30px",
    borderRadius: "20px",
    background: "rgba(30, 40, 70, 0.95)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
  },

  cardTitle: {
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

  switch: {
    marginTop: "15px",
    textAlign: "center",
    color: "#ccc",
  },
};

styles.switchSpan = {
  color: "#4a6cf7",
  cursor: "pointer",
  marginLeft: "6px",
  fontWeight: "bold",
};