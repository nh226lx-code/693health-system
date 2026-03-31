import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import Topbar from "../components/Topbar.jsx";

export default function AdminRecords() {
  const [records, setRecords] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortType, setSortType] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 20;

  const fetchRecords = async () => {
    try {
      const res = await API.get("/health");

      const list = (res.data || []).map((item) => ({
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
    const ok = window.confirm("确定删除该记录？");
    if (!ok) return;
    setRecords((prev) => prev.filter((item) => item._id !== id));
  };

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const id = item.email ? item.email.split("@")[0] : "";
      const email = item.email || "";

      return (
        id.toLowerCase().includes(keyword.toLowerCase()) ||
        email.toLowerCase().includes(keyword.toLowerCase())
      );
    });
  }, [records, keyword]);

  const sortedRecords = useMemo(() => {
    const list = [...filteredRecords];

    if (sortType === "newest") {
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortType === "oldest") {
      list.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortType === "email") {
      list.sort((a, b) => (a.email || "").localeCompare(b.email || ""));
    }

    return list;
  }, [filteredRecords, sortType]);

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, sortType]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage]);

  const exportCSV = () => {
    const headers = ["日期", "用户ID", "邮箱", "步数", "睡眠", "饮水", "体重"];

    const rows = sortedRecords.map((item) => [
      item.date,
      item.email ? item.email.split("@")[0] : "unknown",
      item.email,
      item.steps,
      item.sleep,
      item.water,
      item.weight
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            const value = cell ?? "";
            const text = String(value).replace(/"/g, '""');
            return `"${text}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;"
    });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "health_records.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Topbar />

      <div style={{ padding: 28 }}>
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap"
          }}
        >
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
            健康记录管理
          </h2>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="输入用户ID或邮箱"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                padding: "10px 14px",
                width: 240,
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                outline: "none"
              }}
            />

            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                outline: "none",
                background: "#fff"
              }}
            >
              <option value="newest">按日期：最新</option>
              <option value="oldest">按日期：最旧</option>
              <option value="email">按邮箱排序</option>
            </select>

            <button
              onClick={exportCSV}
              style={{
                padding: "10px 18px",
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
              tableLayout: "fixed",
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
              {pagedRecords.map((item) => (
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

          {sortedRecords.length > 0 && (
            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12
              }}
            >
              <div style={{ color: "#64748b", fontSize: 14 }}>
                共 {sortedRecords.length} 条，每页 20 条
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: "8px 14px",
                    background: currentPage === 1 ? "#cbd5e1" : "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer"
                  }}
                >
                  上一页
                </button>

                <span style={{ color: "#334155", minWidth: 72, textAlign: "center" }}>
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "8px 14px",
                    background:
                      currentPage === totalPages ? "#cbd5e1" : "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer"
                  }}
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}