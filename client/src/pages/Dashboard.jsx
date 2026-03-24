import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    steps: "",
    sleepHours: "",
    waterIntake: "",
    weight: "",
    date: ""
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/health");
      const list = Array.isArray(res.data) ? res.data : [];

      const formatted = list.map((item, index) => ({
        id: item._id || index + 1,
        index: index + 1,
        steps: Number(item.steps) || 0,
        sleepHours: Number(item.sleepHours) || 0,
        waterIntake: Number(item.waterIntake) || 0,
        weight: Number(item.weight) || 0,
        date: item.date
          ? item.date
          : item.createdAt
          ? new Date(item.createdAt).toISOString().slice(0, 10)
          : `记录 ${index + 1}`
      }));

      setRecords(formatted);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const latest = records.length
  ? [...records].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
  : null;

  const bmi =
    latest && latest.weight
      ? (latest.weight / (1.7 * 1.7)).toFixed(1)
      : "--";

const chartData = useMemo(() => {
  return [...records]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => ({
      日期: item.date,
      步数: item.steps,
      睡眠: item.sleepHours,
      饮水: item.waterIntake,
      体重: item.weight
    }));
}, [records]);

  const analysis = useMemo(() => {
    if (!latest) {
      return {
        title: "暂无健康数据",
        text: "请先在数据录入区域提交今日健康数据，系统会自动生成健康分析与建议。"
      };
    }

    const tips = [];

    if (latest.steps < 6000) {
      tips.push("今日步数偏低，建议适当增加步行或轻量运动。");
    } else if (latest.steps >= 10000) {
      tips.push("今日运动量表现较好，请继续保持。");
    } else {
      tips.push("今日步数处于正常范围，可以继续保持稳定活动量。");
    }

    if (latest.sleepHours < 6) {
      tips.push("睡眠时长不足，建议尽量规律作息并提前休息。");
    } else if (latest.sleepHours <= 8) {
      tips.push("睡眠时长较为理想，身体恢复状态预计较好。");
    } else {
      tips.push("睡眠时间较长，建议结合日常状态观察作息质量。");
    }

    if (latest.waterIntake < 1200) {
      tips.push("饮水量偏少，建议分时段补充饮水。");
    } else {
      tips.push("饮水情况较好，继续保持规律补水习惯。");
    }

    if (latest.weight >= 75) {
      tips.push("当前体重建议结合饮食与运动进行持续观察。");
    } else {
      tips.push("体重数据相对平稳，建议继续配合健康生活方式管理。");
    }

    if (bmi !== "--") {
      if (Number(bmi) < 18.5) {
        tips.push("BMI偏低，建议适当增加营养摄入。");
      } else if (Number(bmi) > 24) {
        tips.push("BMI偏高，建议关注饮食结构与运动频率。");
      } else {
        tips.push("BMI处于正常范围，当前身体状态较为理想。");
      }
    }

    return {
      title: "今日健康分析",
      text: tips.join(" ")
    };
  }, [latest, bmi]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async () => {
    if (
      !form.steps ||
      !form.sleepHours ||
      !form.waterIntake ||
      !form.weight ||
      !form.date
    ) {
      alert("请完整填写健康数据");
      return;
    }

    try {
      await API.post("/health", {
        steps: Number(form.steps),
        sleepHours: Number(form.sleepHours),
        waterIntake: Number(form.waterIntake),
        weight: Number(form.weight),
        date: form.date
      });

      setForm({
        steps: "",
        sleepHours: "",
        waterIntake: "",
        weight: "",
        date: ""
      });

      await loadData();
      alert("数据提交成功");
    } catch {
      alert("数据提交失败");
    }
  };

  const goHome = () => navigate("/");
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const cardBase = {
    background: "#ffffff",
    borderRadius: 22,
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(148,163,184,0.14)"
  };

  const metricCards = [
    {
      title: "今日步数",
      value: latest ? latest.steps : "--",
      unit: "步",
      icon: "👟",
      bg: "linear-gradient(135deg,#dbeafe,#eff6ff)",
      valueColor: "#2563eb"
    },
    {
      title: "睡眠时长",
      value: latest ? latest.sleepHours : "--",
      unit: "小时",
      icon: "🌙",
      bg: "linear-gradient(135deg,#dcfce7,#f0fdf4)",
      valueColor: "#16a34a"
    },
    {
      title: "饮水摄入",
      value: latest ? latest.waterIntake : "--",
      unit: "ml",
      icon: "💧",
      bg: "linear-gradient(135deg,#cffafe,#ecfeff)",
      valueColor: "#0891b2"
    },
    {
      title: "当前体重",
      value: latest ? latest.weight : "--",
      unit: "kg",
      icon: "⚖️",
      bg: "linear-gradient(135deg,#ffedd5,#fff7ed)",
      valueColor: "#ea580c"
    },
    {
      title: "BMI指数",
      value: bmi,
      unit: "",
      icon: "📈",
      bg: "linear-gradient(135deg,#ede9fe,#f5f3ff)",
      valueColor: "#7c3aed"
    }
  ];

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #dbe3ee",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
    background: "#f8fafc",
    color: "#0f172a"
  };

  const thStyle = {
  padding: "14px 16px",
  textAlign: "center",
  fontSize: 14,
  fontWeight: 800,
  color: "#1e3a8a",
  borderBottom: "1px solid #dbeafe",
  background: "#eff6ff",
  width: "20%"
};

  const tdStyle = {
  padding: "14px 16px",
  fontSize: 14,
  color: "#334155",
  borderBottom: "1px solid #eef2f7",
  textAlign: "center",
  width: "20%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
};

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#dbeafe 0%, #eef4ff 18%, #f8fafc 55%, #e9edff 100%)",
        padding: "28px 20px 40px"
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            ...cardBase,
            padding: "22px 26px",
            marginBottom: 24,
            background:
              "linear-gradient(135deg,#ffffff 0%, #f8fbff 55%, #eef4ff 100%)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -40,
              top: -40,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(59,130,246,0.14) 0%, rgba(59,130,246,0.05) 45%, rgba(59,130,246,0) 72%)"
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 80,
              bottom: -30,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(14,165,233,0.10) 0%, rgba(14,165,233,0.03) 50%, rgba(14,165,233,0) 72%)"
            }}
          />

          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap"
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: 32,
                color: "#1e3a8a",
                fontWeight: 800
              }}
            >
              个人健康管理中心
            </h1>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={goHome}
                style={{
                  padding: "10px 18px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#1e293b",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                返回首页
              </button>
              <button
                onClick={logout}
                style={{
                  padding: "10px 18px",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                  color: "#ffffff",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 10px 24px rgba(37,99,235,0.28)"
                }}
              >
                退出登录
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 14
            }}
          >
            今日健康情况
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 20
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 16
              }}
            >
              {metricCards.map((item, index) => (
                <div
                  key={index}
                  style={{
                    ...cardBase,
                    padding: 18,
                    background: item.bg
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16
                    }}
                  >
                    <span
                      style={{
                        color: "#64748b",
                        fontSize: 14,
                        fontWeight: 600
                      }}
                    >
                      {item.title}
                    </span>
                    <span style={{ fontSize: 24 }}>{item.icon}</span>
                  </div>

                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: item.valueColor,
                      lineHeight: 1
                    }}
                  >
                    {item.value}
                    {item.unit ? (
                      <span
                        style={{
                          fontSize: 14,
                          marginLeft: 6,
                          color: "#475569",
                          fontWeight: 600
                        }}
                      >
                        {item.unit}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                ...cardBase,
                padding: 22,
                background:
                  "linear-gradient(135deg,#ffffff 0%, #f8fbff 60%, #eef6ff 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: 12
                  }}
                >
                  健康分析与建议
                </div>
                <div
                  style={{
                    color: "#475569",
                    lineHeight: 1.8,
                    fontSize: 15
                  }}
                >
                  {analysis.text}
                </div>
              </div>

            
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 14
            }}
          >
        
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "360px 1fr",
              gap: 20
            }}
          >
            <div
              style={{
                ...cardBase,
                padding: 24,
                background: "#ffffff",
                minHeight: 458,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: 18
                }}
              >
                数据录入
              </div>

              <div style={{ display: "grid", gap: 14, flex: 1 }}>
                <div>
                  <div
                    style={{
                      marginBottom: 8,
                      color: "#475569",
                      fontSize: 14,
                      fontWeight: 600
                    }}
                  >
                    记录日期
                  </div>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <div
                    style={{
                      marginBottom: 8,
                      color: "#475569",
                      fontSize: 14,
                      fontWeight: 600
                    }}
                  >
                    今日步数
                  </div>
                  <input
                    value={form.steps}
                    onChange={(e) => handleChange("steps", e.target.value)}
                    placeholder="请输入今日步数"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <div
                    style={{
                      marginBottom: 8,
                      color: "#475569",
                      fontSize: 14,
                      fontWeight: 600
                    }}
                  >
                    睡眠时长
                  </div>
                  <input
                    value={form.sleepHours}
                    onChange={(e) => handleChange("sleepHours", e.target.value)}
                    placeholder="请输入睡眠小时数"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <div
                    style={{
                      marginBottom: 8,
                      color: "#475569",
                      fontSize: 14,
                      fontWeight: 600
                    }}
                  >
                    饮水摄入
                  </div>
                  <input
                    value={form.waterIntake}
                    onChange={(e) =>
                      handleChange("waterIntake", e.target.value)
                    }
                    placeholder="请输入饮水量（ml）"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <div
                    style={{
                      marginBottom: 8,
                      color: "#475569",
                      fontSize: 14,
                      fontWeight: 600
                    }}
                  >
                    当前体重
                  </div>
                  <input
                    value={form.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                    placeholder="请输入体重（kg）"
                    style={inputStyle}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  style={{
                    marginTop: 6,
                    height: 48,
                    borderRadius: 14,
                    border: "none",
                    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                    color: "#ffffff",
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 12px 26px rgba(37,99,235,0.24)"
                  }}
                >
                  提交健康数据
                </button>
              </div>
            </div>

            <div
              style={{
                ...cardBase,
                padding: 22,
                background: "#ffffff",
                minHeight: 458,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#0f172a"
                  }}
                >
                  曲线分析
                </div>

              </div>

              <div
                style={{
                  flex: 1,
                  borderRadius: 18,
                  background:
                    "linear-gradient(180deg,#f8fbff 0%, #ffffff 32%, #fcfdff 100%)",
                  border: "1px solid #edf2f7",
                  padding: 14
                }}
              >
                <ResponsiveContainer width="100%" height="300">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 12, left: 0, bottom: 6 }}
                  >
                    <CartesianGrid stroke="#e8eef7" strokeDasharray="4 4" />
                    <XAxis
                      dataKey="日期"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={{ stroke: "#d9e3f0" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={{ stroke: "#d9e3f0" }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 14,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 10px 30px rgba(15,23,42,0.08)"
                      }}
                      labelStyle={{ color: "#0f172a", fontWeight: 700 }}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: 8,
                        fontSize: 13
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="步数"
                      name="步数"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 3, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="睡眠"
                      name="睡眠"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{ r: 3, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="饮水"
                      name="饮水"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      dot={{ r: 3, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="体重"
                      name="体重"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ r: 3, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 14
            }}
          >
            历史数据
          </div>

          <div
            style={{
              ...cardBase,
              background: "#ffffff",
              overflow: "hidden"
            }}
          >
            <table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed"
  }}
>
          
              <thead>
                <tr>
                  <th style={thStyle}>日期</th>
                  <th style={thStyle}>步数</th>
                  <th style={thStyle}>睡眠</th>
                  <th style={thStyle}>饮水</th>
                  <th style={thStyle}>体重</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: 28,
                        textAlign: "center",
                        color: "#64748b"
                      }}
                    >
                      数据加载中...
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: 28,
                        textAlign: "center",
                        color: "#64748b"
                      }}
                    >
                      暂无历史数据
                    </td>
                  </tr>
                ) : (
              [...records]
               .sort((a, b) => new Date(b.date) - new Date(a.date))
            
  .map((item, index) => (
                      <tr
                        key={item.id || index}
                        style={{
                          background: index % 2 === 0 ? "#ffffff" : "#fafcff"
                        }}
                      >

                        <td style={tdStyle}>{item.date}</td>
                        <td style={tdStyle}>{item.steps}</td>
                        <td style={tdStyle}>{item.sleepHours} h</td>
                        <td style={tdStyle}>{item.waterIntake} ml</td>
                        <td style={tdStyle}>{item.weight} kg</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}