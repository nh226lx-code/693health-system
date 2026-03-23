import React, { useState, useEffect } from "react";
import API from "../services/api";

export default function HealthForm() {
  const [steps, setSteps] = useState(5000);
  const [sleepHours, setSleepHours] = useState(7);
  const [waterIntake, setWaterIntake] = useState(2);
  const [weight, setWeight] = useState(60);
  const [height, setHeight] = useState(170);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common["Authorization"] = token;
    }
  }, []);

  const handleSubmit = async () => {
    try {
      await API.post("/health", {
        steps,
        sleepHours,
        waterIntake,
        weight,
        height
      });
      alert("数据已保存");
    } catch {
      alert("提交失败");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0f2f5",
      padding: 40
    }}>
      <div style={{
        maxWidth: 800,
        margin: "0 auto",
        background: "white",
        borderRadius: 16,
        padding: 30,
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{
          textAlign: "center",
          marginBottom: 30,
          fontSize: 24,
          fontWeight: 600
        }}>
          健康数据录入
        </h2>

        {/* 分区1：基础活动 */}
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ marginBottom: 15 }}>🏃 基础活动</h3>

          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <label>步数（步）</label>
              <select
                style={{ width: "100%", padding: 10, marginTop: 5 }}
                onChange={(e) => setSteps(Number(e.target.value))}
              >
                {[1000,3000,5000,8000,10000,12000].map(v => (
                  <option key={v} value={v}>{v} 步</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label>睡眠（小时）</label>
              <select
                style={{ width: "100%", padding: 10, marginTop: 5 }}
                onChange={(e) => setSleepHours(Number(e.target.value))}
              >
                {[4,5,6,7,8,9].map(v => (
                  <option key={v} value={v}>{v} 小时</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 分区2：身体指标 */}
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ marginBottom: 15 }}>📊 身体指标</h3>

          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <label>体重（kg）</label>
              <select
                style={{ width: "100%", padding: 10, marginTop: 5 }}
                onChange={(e) => setWeight(Number(e.target.value))}
              >
                {[50,55,60,65,70,75,80].map(v => (
                  <option key={v} value={v}>{v} kg</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label>身高（cm）</label>
              <select
                style={{ width: "100%", padding: 10, marginTop: 5 }}
                onChange={(e) => setHeight(Number(e.target.value))}
              >
                {[150,160,170,175,180,185].map(v => (
                  <option key={v} value={v}>{v} cm</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 分区3：饮食 */}
        <div style={{ marginBottom: 30 }}>
          <h3 style={{ marginBottom: 15 }}>💧 饮食</h3>

          <label>饮水量（升）</label>
          <select
            style={{ width: "100%", padding: 10, marginTop: 5 }}
            onChange={(e) => setWaterIntake(Number(e.target.value))}
          >
            {[1,1.5,2,2.5,3].map(v => (
              <option key={v} value={v}>{v} L</option>
            ))}
          </select>
        </div>

        {/* 按钮 */}
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: 12,
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            cursor: "pointer"
          }}
        >
          提交健康数据
        </button>
      </div>
    </div>
  );
}