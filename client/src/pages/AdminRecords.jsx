import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import Topbar from "../components/Topbar.jsx";

export default function AdminRecords() {
  const [records, setRecords] = useState([]);
  const [keyword, setKeyword] = useState("");

  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return "⇅";
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

    list.sort((a, b) => {
      let v1 = a[sortField];
      let v2 = b[sortField];

      if (sortField === "date") {
        v1 = new Date(v1);
        v2 = new Date(v2);
      }

      if (v1 < v2) return sortOrder === "asc" ? -1 : 1;
      if (v1 > v2) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [filteredRecords, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, sortField, sortOrder]);

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
    const headers = ["序号", "日期", "用户ID", "邮箱", "步数", "睡眠", "饮水", "体重"];

    const rows = sortedRecords.map((item, i) => [
      i + 1,
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
        row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
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

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const rows = text.split("\n").slice(1);

        for (let row of rows) {
          if (!row.trim()) continue;

          const [email, username, date, steps, sleep, water, weight] = row.split(",");

          if (!email || !date) continue;

          try {
            await API.post("/users", {
              email,
              username,
              role: "user"
            });
          } catch {}

          try {
            await API.post("/health", {
              user: email,
              date,
              steps: Number(steps),
              sleep: Number(sleep),
              water: Number(water),
              weight: Number(weight)
            });
          } catch {}
        }

        alert("导入完成");
        fetchRecords();
      } catch {
        alert("导入失败，请检查CSV格式");
      }

      e.target.value = "";
    };

    reader.readAsText(file);
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

            <button
              style={{
                padding: "10px 16px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 500
              }}
            >
              搜索
            </button>

            <input
              id="import-file"
              type="file"
              accept=".csv"
              onChange={handleImport}
              style={{ display: "none" }}
            />

            <label htmlFor="import-file">
              <span
                style={{
                  display: "inline-block",
                  padding: "10px 18px",
                  background: "#2563eb",
                  color: "#fff",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                导入数据
              </span>
            </label>

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
              textAlign: "center"
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: 14 }}>序号</th>
                <th
                  style={{ padding: 14, cursor: "pointer" }}
                  onClick={() => handleSort("date")}
                >
                  日期 {getSortIcon("date")}
                </th>
                <th
                  style={{ padding: 14, cursor: "pointer" }}
                  onClick={() => handleSort("email")}
                >
                  用户 {getSortIcon("email")}
                </th>
                <th
                  style={{ padding: 14, cursor: "pointer" }}
                  onClick={() => handleSort("email")}
                >
                  邮箱 {getSortIcon("email")}
                </th>
                <th
                  style={{ padding: 14, cursor: "pointer" }}
                  onClick={() => handleSort("steps")}
                >
                  步数 {getSortIcon("steps")}
                </th>
                <th
                  style={{ padding: 14, cursor: "pointer" }}
                  onClick={() => handleSort("sleep")}
                >
                  睡眠 {getSortIcon("sleep")}
                </th>
                <th
                  style={{ padding: 14, cursor: "pointer" }}
                  onClick={() => handleSort("water")}
                >
                  饮水 {getSortIcon("water")}
                </th>
                <th
                  style={{ padding: 14, cursor: "pointer" }}
                  onClick={() => handleSort("weight")}
                >
                  体重 {getSortIcon("weight")}
                </th>
                <th style={{ padding: 14 }}>操作</th>
              </tr>
            </thead>

            <tbody>
              {pagedRecords.map((item, index) => (
                <tr key={item._id}>
                  <td style={{ padding: 14 }}>
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td style={{ padding: 14 }}>{item.date}</td>
                  <td style={{ padding: 14 }}>{item.email?.split("@")[0]}</td>
                  <td style={{ padding: 14 }}>{item.email}</td>
                  <td style={{ padding: 14 }}>{item.steps}</td>
                  <td style={{ padding: 14 }}>{item.sleep}</td>
                  <td style={{ padding: 14 }}>{item.water}</td>
                  <td style={{ padding: 14 }}>{item.weight}</td>
                  <td style={{ padding: 14 }}>
                    <button
                      onClick={() => handleDelete(item._id)}
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: 6,
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