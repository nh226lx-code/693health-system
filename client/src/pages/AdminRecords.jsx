import React, { useEffect, useState } from "react";
import API from "../services/api";
import Topbar from "../components/Topbar.jsx";

export default function AdminRecords() {
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const res = await API.get("/admin/records");
      setRecords(res.data);
    } catch (err) {
      alert("获取记录失败");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/records/${id}`);
      fetchRecords();
    } catch (err) {
      alert("删除失败");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Topbar />

      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#0f172a" }}>
            健康记录管理
          </h2>
          <p style={{ marginTop: 8, color: "#64748b" }}>
            统一查看和维护全部用户的健康数据记录
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 20,
            boxShadow: "0 10px 30px rgba(15,23,42,0.06)"
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ textAlign: "left", padding: 14 }}>用户ID</th>
                <th style={{ textAlign: "left", padding: 14 }}>步数</th>
                <th style={{ textAlign: "left", padding: 14 }}>睡眠</th>
                <th style={{ textAlign: "left", padding: 14 }}>饮水</th>
                <th style={{ textAlign: "left", padding: 14 }}>体重</th>
                <th style={{ textAlign: "left", padding: 14 }}>操作</th>
              </tr>
            </thead>

            <tbody>
              {records.map((item) => (
                <tr key={item._id} style={{ borderBottom: "1px solid #eef2f7" }}>
                  <td style={{ padding: 14, color: "#64748b", fontSize: 13 }}>
                    {item.userId}
                  </td>
                  <td style={{ padding: 14 }}>{item.steps} 步</td>
                  <td style={{ padding: 14 }}>{item.sleepHours} 小时</td>
                  <td style={{ padding: 14 }}>{item.waterIntake} L</td>
                  <td style={{ padding: 14 }}>{item.weight} kg</td>
                  <td style={{ padding: 14 }}>
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
        </div>
      </div>
    </div>
  );
}