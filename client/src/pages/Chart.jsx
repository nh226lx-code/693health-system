import React, { useEffect, useState } from "react";
import API from "../services/api";
import Topbar from "../components/Topbar.jsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function ChartPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/health");

      const formatted = res.data.map((item, index) => ({
        index: index + 1,
        steps: item.steps,
        sleep: item.sleepHours,
        water: item.waterIntake,
        weight: item.weight
      }));

      setData(formatted);
    };

    fetchData();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Topbar />

      <div style={{ padding: 30 }}>
        <h2 style={{ marginBottom: 20 }}>健康数据趋势</h2>

        {/* 卡片区（解决挤在一起问题） */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 20,
          marginBottom: 30
        }}>
          {data.length > 0 && [
            ["记录次数", data.length],
            ["最高步数", Math.max(...data.map(d => d.steps))],
            ["平均睡眠", (data.reduce((a, b) => a + b.sleep, 0) / data.length).toFixed(1)],
            ["平均饮水", (data.reduce((a, b) => a + b.water, 0) / data.length).toFixed(1)]
          ].map(([label, value], i) => (
            <div key={i} style={{
              background: "white",
              padding: 20,
              borderRadius: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
            }}>
              <p style={{ color: "#64748b", marginBottom: 10 }}>{label}</p>
              <h2 style={{ margin: 0 }}>{value}</h2>
            </div>
          ))}
        </div>

        {/* 图表 */}
        <div style={{
          background: "white",
          padding: 20,
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
        }}>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="steps" stroke="#2563eb" strokeWidth={3} />
              <Line type="monotone" dataKey="sleep" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}