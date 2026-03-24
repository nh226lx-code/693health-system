import React, { useEffect, useState } from "react";
import API from "../services/api";
import Topbar from "../components/Topbar.jsx";

export default function AdminRecords() {
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
     
      const res = await API.get("/health");

      const list = res.data.map((item, i) => ({
        _id: i,
        userId: "用户" + (i + 1),
        steps: item.steps || 0,
        sleepHours: item.sleep || 0,
        waterIntake: item.water || 0,
        weight: item.weight || 0
      }));

      setRecords(list);
    } catch {
      setRecords([]);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = (id) => {
    // ✅ 本地删除（避免调用不存在接口）
    setRecords(records.filter((item) => item._id !== id));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Topbar />

      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
            健康记录管理
          </h2>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 20,
            boxShadow: "0 10px 30px rgba(15,23,42,0.06)"
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
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: 14 }}>用户ID</th>
                <th style={{ padding: 14 }}>步数</th>
                <th style={{ padding: 14 }}>睡眠</th>
                <th style={{ padding: 14 }}>饮水</th>
                <th style={{ padding: 14 }}>体重</th>
                <th style={{ padding: 14 }}>操作</th>
              </tr>
            </thead>

            <tbody>
              {records.map((item) => (
                <tr key={item._id} style={{ borderBottom: "1px solid #eef2f7" }}>
                  <td style={{ padding: 14 }}>{item.userId}</td>
                  <td style={{ padding: 14 }}>{item.steps} 步</td>
                  <td style={{ padding: 14 }}>{item.sleepHours} 小时</td>
                  <td style={{ padding: 14 }}>{item.waterIntake} L</td>
                  <td style={{ padding: 14 }}>{item.weight} kg</td>
                  <td style={{ padding: 14, textAlign: "center" }}>
                    <button
                      onClick={() => handleDelete(item._id)}
                      style={{
                        padding: "8px 14px",
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        cursor: "pointer"
                      }}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {records.length === 0 && (
            <div style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
              暂无数据
            </div>
          )}
        </div>
      </div>
    </div>
  );
}