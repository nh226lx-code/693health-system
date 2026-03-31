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
      const res = await API.get("/health?_t=" + Date.now());

      const list = (res.data || []).map((item) => {
        const rawUser = item.user || "";
        const email = typeof rawUser === "string" ? rawUser.replace(/-token$/i, "") : "";

        return {
          _id: item._id,
          user: rawUser || "unknown",
          email,
          date: item.date || "",
          steps: Number(item.steps) || 0,
          sleep: Number(item.sleep) || 0,
          water: Number(item.water) || 0,
          weight: Number(item.weight) || 0
        };
      });

      setRecords(list);
    } catch {
      setRecords([]);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("确定删除该记录？");
    if (!ok) return;

    try {
      await API.delete(`/health/${id}`);
      await fetchRecords();
    } catch {
      alert("删除失败");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);

    if (field === "date" || ["steps", "sleep", "water", "weight"].includes(field)) {
      setSortOrder("desc");
    } else {
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
    const kw = keyword.trim().toLowerCase();

    return records.filter((item) => {
      const email = String(item.email || "").toLowerCase();
      const userId = email ? email.split("@")[0] : "";

      if (email === "test@admin.com") {
        return false;
      }

      if (!kw) return true;

      return userId.includes(kw) || email.includes(kw);
    });
  }, [records, keyword]);

  const sortedRecords = useMemo(() => {
    const list = [...filteredRecords];

    list.sort((a, b) => {
      if (sortField === "date") {
        const t1 = new Date(a.date || "1970-01-01").getTime();
        const t2 = new Date(b.date || "1970-01-01").getTime();

        if (t1 !== t2) {
          return sortOrder === "asc" ? t1 - t2 : t2 - t1;
        }

        const e1 = String(a.email || "").toLowerCase();
        const e2 = String(b.email || "").toLowerCase();
        return e1.localeCompare(e2);
      }

      if (["steps", "sleep", "water", "weight"].includes(sortField)) {
        const n1 = Number(a[sortField]) || 0;
        const n2 = Number(b[sortField]) || 0;

        if (n1 !== n2) {
          return sortOrder === "asc" ? n1 - n2 : n2 - n1;
        }

        return 0;
      }

      const v1 = String(a[sortField] || "").toLowerCase();
      const v2 = String(b[sortField] || "").toLowerCase();

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

  const parseCSVLine = (line) => {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const next = line[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result.map((item) => item.replace(/^"|"$/g, "").trim());
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = String(event.target?.result || "").replace(/^\ufeff/, "");
        const rows = text
          .split(/\r?\n/)
          .map((row) => row.trim())
          .filter(Boolean);

        if (rows.length <= 1) {
          alert("导入失败，请检查CSV格式");
          e.target.value = "";
          return;
        }

        const header = parseCSVLine(rows[0]).map((item) => item.toLowerCase());
        const isExportTemplate =
          header.includes("序号") &&
          header.includes("日期") &&
          header.includes("邮箱");

        for (let i = 1; i < rows.length; i++) {
          const cols = parseCSVLine(rows[i]);
          if (!cols.length) continue;

          let email = "";
          let username = "";
          let date = "";
          let steps = 0;
          let sleep = 0;
          let water = 0;
          let weight = 0;

          if (isExportTemplate) {
            email = cols[3] || "";
            username = cols[2] || "";
            date = cols[1] || "";
            steps = cols[4] || 0;
            sleep = cols[5] || 0;
            water = cols[6] || 0;
            weight = cols[7] || 0;
          } else {
            email = cols[0] || "";
            username = cols[1] || "";
            date = cols[2] || "";
            steps = cols[3] || 0;
            sleep = cols[4] || 0;
            water = cols[5] || 0;
            weight = cols[6] || 0;
          }

          if (!email || !date) continue;

          try {
            await API.post("/users", {
              email,
              username: username || email.split("@")[0],
              password: "123456",
              role: "user"
            });
          } catch {}

          try {
            await API.post("/health", {
              user: `${email}-token`,
              date,
              steps: Number(steps) || 0,
              sleep: Number(sleep) || 0,
              water: Number(water) || 0,
              weight: Number(weight) || 0
            });
          } catch {}
        }

        await fetchRecords();
        setTimeout(fetchRecords, 500);

        alert("导入完成");
      } catch {
        alert("导入失败，请检查CSV格式");
      }

      e.target.value = "";
    };

    reader.readAsText(file);
  };

  const actionButtonStyle = {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "20px"
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
                outline: "none",
                fontSize: 14,
                lineHeight: "20px"
              }}
            />

            <button
              style={{
                ...actionButtonStyle,
                background: "#2563eb",
                color: "#fff"
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
                  ...actionButtonStyle,
                  display: "inline-block",
                  background: "#2563eb",
                  color: "#fff"
                }}
              >
                导入数据
              </span>
            </label>

            <button
              onClick={exportCSV}
              style={{
                ...actionButtonStyle,
                background: "#16a34a",
                color: "#fff"
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
                <th style={{ padding: 14, cursor: "pointer" }} onClick={() => handleSort("date")}>
                  日期 {getSortIcon("date")}
                </th>
                <th style={{ padding: 14, cursor: "pointer" }} onClick={() => handleSort("email")}>
                  用户 {getSortIcon("email")}
                </th>
                <th style={{ padding: 14, cursor: "pointer" }} onClick={() => handleSort("email")}>
                  邮箱 {getSortIcon("email")}
                </th>
                <th style={{ padding: 14, cursor: "pointer" }} onClick={() => handleSort("steps")}>
                  步数 {getSortIcon("steps")}
                </th>
                <th style={{ padding: 14, cursor: "pointer" }} onClick={() => handleSort("sleep")}>
                  睡眠 {getSortIcon("sleep")}
                </th>
                <th style={{ padding: 14, cursor: "pointer" }} onClick={() => handleSort("water")}>
                  饮水 {getSortIcon("water")}
                </th>
                <th style={{ padding: 14, cursor: "pointer" }} onClick={() => handleSort("weight")}>
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
                        cursor: "pointer",
                        fontSize: 14,
                        lineHeight: "20px"
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
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    fontSize: 14,
                    lineHeight: "20px"
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
                      currentPage === totalPages ? "not-allowed" : "pointer",
                    fontSize: 14,
                    lineHeight: "20px"
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