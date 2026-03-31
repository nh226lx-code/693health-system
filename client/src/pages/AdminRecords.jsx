import React, { useEffect, useState } from "react";
import API from "../services/api";
import Topbar from "../components/Topbar.jsx";

export default function AdminRecords() {
  const [records, setRecords] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortType, setSortType] = useState("newest");

  const fetchRecords = async () => {
    try {
      const res = await API.get("/health");

      const list = res.data.map((item) => ({
        _id: item._id,
        user: item.user || "unknown",
        email: (item.user || "").replace("-token", ""),
        date: item.date || "",
        steps: item.steps || 0,
        sleep: item.sleep || 0,
        water: item.water || 0,
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
    setRecords(records.filter((item) => item._id !== id));
  };

  // 搜索
  const filteredRecords = records.filter((item) => {
    const id = item.email ? item.email.split("@")[0] : "";
    const email = item.email || "";

    return (
      id.toLowerCase().includes(keyword.toLowerCase()) ||
      email.toLowerCase().includes(keyword.toLowerCase())
    );
  });

  // 排序
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortType === "newest") {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortType === "oldest") {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortType === "email") {
      return a.email.localeCompare(b.email);
    }
    return 0;
  });

  // 导出CSV
  const exportCSV = () => {
    const headers = ["邮箱", "日期", "步数", "睡眠", "饮水", "体重"];

    const rows = sortedRecords.map((item) => [
      item.email,
      item.date,
      item.steps,
      item.sleep,
      item.water,
      item.weight
    ]);

    const csvContent =
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "health_data.csv";
    a.click();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Topbar />

      <div style={{ padding: 28 }}>
        {/* 标题 + 控制区 */}
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
            健康记录管理
          </h2>

          <div style={{ display: "flex", gap: 10 }}>
            {/* 搜索 */}
            <input
              type="text"
              placeholder="输入用户ID或邮箱"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                padding: "10px 14px",
                width: 220,
                borderRadius: 10,
                border: "1px solid #e2e8f0"
              }}
            />

            {/* 排序 */}
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #e2e8f0"
              }}
            >
              <option value="newest">最新</option>
              <option value="oldest">最旧</option>
              <option value="email">邮箱排序</option>
            </select>

            {/* 导出 */}
            <button
              onClick={exportCSV}
              style={{
                padding: "10px 16px",
                background: "#16a34a",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 500
              }}
            >
              导出数据
            </button>
          </div>
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
              textAlign: "center"
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: 14 }}>日期</th>
                <th style={{ padding: 14 }}>用户ID</th>
                <th style={{ padding: 14 }}>邮箱</th>
                <th style={{ padding: 14 }}>步数</th>
                <th style={{ padding: 14 }}>睡眠</th>
                <th style={{ padding: 14 }}>饮水</th>
                <th style={{ padding: 14 }}>体重</th>
                <th style={{ padding: 14 }}>操作</th>
              </tr>
            </thead>

            <tbody>
              {sortedRecords.map((item) => (
                <tr key={item._id} style={{ borderBottom: "1px solid #eef2f7" }}>
                  <td style={{ padding: 14 }}>{item.date}</td>
                  <td style={{ padding: 14 }}>
                    {item.email ? item.email.split("@")[0] : "unknown"}
                  </td>
                  <td style={{ padding: 14 }}>{item.email}</td>
                  <td style={{ padding: 14 }}>{item.steps}</td>
                  <td style={{ padding: 14 }}>{item.sleep}</td>
                  <td style={{ padding: 14 }}>{item.water}</td>
                  <td style={{ padding: 14 }}>{item.weight}</td>
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

          {sortedRecords.length === 0 && (
            <div style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
              暂无数据
            </div>
          )}
        </div>
      </div>
    </div>
  );
}