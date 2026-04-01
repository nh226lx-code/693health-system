import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import Topbar from "../components/Topbar.jsx";

export default function AdminRecords() {
  const [records, setRecords] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const pageSize = 20;

  const cleanEmail = (value) => {
    if (!value) return "";
    let text = String(value).trim().replace(/-token$/i, "");
    text = text.replace(/^"+|"+$/g, "").trim();
    text = text.replace(/[\u0000-\u001f]/g, "").trim();
    if (text.includes(",")) {
      text = text.split(",")[0].trim();
    }
    return text;
  };

  const formatDateText = (value) => {
    if (!value) return "";
    const text = String(value).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
    const date = new Date(text);
    if (Number.isNaN(date.getTime())) return text;
    return date.toISOString().slice(0, 10);
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await API.get("/health?_t=" + Date.now());

      if (!Array.isArray(res.data)) {
        setRecords([]);
        return;
      }

      const list = res.data.map((item) => {
        const email = cleanEmail(item.user || "");

        return {
          _id: item._id,
          user: email || "unknown",
          email,
          username: email ? email.split("@")[0] : "unknown",
          date: formatDateText(item.date || ""),
          steps: Number(item.steps) || 0,
          sleep: Number(item.sleep) || 0,
          water: Number(item.water) || 0,
          weight: Number(item.weight) || 0
        };
      });

      setRecords(list);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRecords([]);
    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("确定删除该记录？");
    if (!ok) return;

    try {
      await API.delete(`/health/${id}`);
      await fetchRecords();
      window.dispatchEvent(new Event("storage"));
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
      const userId = String(item.username || "").toLowerCase();

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

        return sortOrder === "asc"
          ? String(a.email || "").localeCompare(String(b.email || ""))
          : String(b.email || "").localeCompare(String(a.email || ""));
      }

      if (["steps", "sleep", "water", "weight"].includes(sortField)) {
        const n1 = Number(a[sortField]) || 0;
        const n2 = Number(b[sortField]) || 0;

        if (n1 !== n2) {
          return sortOrder === "asc" ? n1 - n2 : n2 - n1;
        }

        return String(a.email || "").localeCompare(String(b.email || ""));
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
      item.username || "unknown",
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

  const createUserIfNeeded = async (email, username) => {
    const clean = cleanEmail(email);
    if (!clean || String(clean).toLowerCase() === "test@admin.com") return;

    try {
      await API.post("/users", {
        email: clean,
        username: username || clean.split("@")[0],
        password: "123456",
        role: "user"
      });
    } catch {}
  };

  const createRecordIfNeeded = async (payload) => {
    const email = cleanEmail(payload.user);
    const date = formatDateText(payload.date);

    if (!email || !date) {
      return false;
    }

    try {
      const res = await API.post("/health", {
        user: email,
        date,
        steps: Number(payload.steps) || 0,
        sleep: Number(payload.sleep) || 0,
        water: Number(payload.water) || 0,
        weight: Number(payload.weight) || 0
      });

      return !!res.data;
    } catch {
      return false;
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = String(event.target?.result || "")
          .replace(/^\ufeff/, "")
          .replace(/�/g, "");

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

        let successCount = 0;

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
            email = cleanEmail(cols[3] || "");
            username = String(cols[2] || "").trim();
            date = String(cols[1] || "").trim();
            steps = cols[4] || 0;
            sleep = cols[5] || 0;
            water = cols[6] || 0;
            weight = cols[7] || 0;
          } else {
            email = cleanEmail(cols[0] || "");

            if (String(cols[2] || "").trim().match(/^\d{4}-\d{2}-\d{2}$/)) {
              username = String(cols[1] || "").trim();
              date = String(cols[2] || "").trim();
              steps = cols[3] || 0;
              sleep = cols[4] || 0;
              water = cols[5] || 0;
              weight = cols[6] || 0;
            } else {
              username = email ? email.split("@")[0] : "";
              date = String(cols[1] || "").trim();
              steps = cols[2] || 0;
              sleep = cols[3] || 0;
              water = cols[4] || 0;
              weight = cols[5] || 0;
            }
          }

          if (!email) continue;

          await createUserIfNeeded(email, username);

          const added = await createRecordIfNeeded({
            user: email,
            date: formatDateText(date),
            steps: Number(steps) || 0,
            sleep: Number(sleep) || 0,
            water: Number(water) || 0,
            weight: Number(weight) || 0
          });

          if (added) successCount++;
        }

        setCurrentPage(1);
        await fetchRecords();
        setTimeout(() => {
          fetchRecords();
        }, 1500);
        window.dispatchEvent(new Event("storage"));
        alert(`导入成功，共 ${successCount} 条`);
      } catch {
        alert("导入失败，请检查CSV格式");
      }

      e.target.value = "";
    };

    reader.readAsText(file);
  };

  const toolbarButtonStyle = {
    height: 44,
    padding: "0 18px",
    borderRadius: 12,
    border: "1px solid transparent",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    lineHeight: "20px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    transition: "all 0.2s ease"
  };

  const thStyle = {
    padding: "16px 14px",
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap"
  };

  const tdStyle = {
    padding: "16px 14px",
    fontSize: 14,
    color: "#334155",
    borderBottom: "1px solid #eef2f7",
    whiteSpace: "nowrap"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fbff 0%, #f3f6fb 45%, #eef3f9 100%)"
      }}
    >
      <Topbar />

      <div style={{ padding: "28px 28px 36px" }}>
        <div
          style={{
            marginBottom: 22,
            padding: "24px 26px",
            borderRadius: 24,
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(226,232,240,0.9)",
            boxShadow: "0 18px 45px rgba(15,23,42,0.06)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 18,
              flexWrap: "wrap"
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 30,
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "0.3px"
                }}
              >
                健康记录管理
              </h2>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 260,
                  minWidth: 220
                }}
              >
                <input
                  type="text"
                  placeholder="输入用户ID或邮箱"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{
                    width: "100%",
                    height: 44,
                    padding: "0 14px",
                    borderRadius: 12,
                    border: "1px solid #dbe3ee",
                    outline: "none",
                    fontSize: 14,
                    color: "#0f172a",
                    background: "#ffffff",
                    boxShadow: "inset 0 1px 2px rgba(15,23,42,0.03)"
                  }}
                />
              </div>

              <button
                style={{
                  ...toolbarButtonStyle,
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  color: "#fff",
                  boxShadow: "0 10px 22px rgba(37,99,235,0.22)"
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
                    ...toolbarButtonStyle,
                    background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                    color: "#fff",
                    boxShadow: "0 10px 22px rgba(37,99,235,0.18)"
                  }}
                >
                  导入数据
                </span>
              </label>

              <button
                onClick={exportCSV}
                style={{
                  ...toolbarButtonStyle,
                  background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                  color: "#fff",
                  boxShadow: "0 10px 22px rgba(22,163,74,0.18)"
                }}
              >
                导出数据
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.96)",
            borderRadius: 28,
            border: "1px solid rgba(226,232,240,0.9)",
            boxShadow: "0 18px 45px rgba(15,23,42,0.06)",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              padding: "18px 22px",
              borderBottom: "1px solid #edf2f7",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              background:
                "linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(255,255,255,0.96) 100%)"
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
              记录列表
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              共 {sortedRecords.length} 条记录
            </div>
          </div>

          <div style={{ width: "100%", overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 1080,
                borderCollapse: "separate",
                borderSpacing: 0,
                textAlign: "center"
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>序号</th>
                  <th
                    style={{ ...thStyle, cursor: "pointer" }}
                    onClick={() => handleSort("date")}
                  >
                    日期 {getSortIcon("date")}
                  </th>
                  <th
                    style={{ ...thStyle, cursor: "pointer" }}
                    onClick={() => handleSort("username")}
                  >
                    用户 {getSortIcon("username")}
                  </th>
                  <th
                    style={{ ...thStyle, cursor: "pointer" }}
                    onClick={() => handleSort("email")}
                  >
                    邮箱 {getSortIcon("email")}
                  </th>
                  <th
                    style={{ ...thStyle, cursor: "pointer" }}
                    onClick={() => handleSort("steps")}
                  >
                    步数 {getSortIcon("steps")}
                  </th>
                  <th
                    style={{ ...thStyle, cursor: "pointer" }}
                    onClick={() => handleSort("sleep")}
                  >
                    睡眠 {getSortIcon("sleep")}
                  </th>
                  <th
                    style={{ ...thStyle, cursor: "pointer" }}
                    onClick={() => handleSort("water")}
                  >
                    饮水 {getSortIcon("water")}
                  </th>
                  <th
                    style={{ ...thStyle, cursor: "pointer" }}
                    onClick={() => handleSort("weight")}
                  >
                    体重 {getSortIcon("weight")}
                  </th>
                  <th style={thStyle}>操作</th>
                </tr>
              </thead>

              <tbody>
                {pagedRecords.map((item, index) => (
                  <tr
                    key={item._id}
                    style={{
                      background: index % 2 === 0 ? "#ffffff" : "#fbfdff",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <td style={tdStyle}>
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td style={{ ...tdStyle, color: "#0f172a", fontWeight: 600 }}>
                      {item.date}
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 92,
                          padding: "6px 12px",
                          borderRadius: 999,
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          fontWeight: 700
                        }}
                      >
                        {item.username}
                      </span>
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        maxWidth: 240,
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {item.email}
                    </td>
                    <td style={tdStyle}>{item.steps}</td>
                    <td style={tdStyle}>{item.sleep}</td>
                    <td style={tdStyle}>{item.water}</td>
                    <td style={tdStyle}>{item.weight}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleDelete(item._id)}
                        style={{
                          height: 38,
                          padding: "0 16px",
                          borderRadius: 10,
                          border: "none",
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#fff",
                          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                          boxShadow: "0 10px 20px rgba(239,68,68,0.18)"
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

          {!loading && sortedRecords.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "54px 20px",
                color: "#64748b",
                fontSize: 15
              }}
            >
              暂无数据
            </div>
          )}

          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "54px 20px",
                color: "#64748b",
                fontSize: 15
              }}
            >
              数据加载中...
            </div>
          )}

          {sortedRecords.length > 0 && (
            <div
              style={{
                padding: "18px 22px 22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12
              }}
            >
              <div
                style={{
                  color: "#64748b",
                  fontSize: 14
                }}
              >
                共 {sortedRecords.length} 条，每页 20 条
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                }}
              >
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    height: 40,
                    padding: "0 16px",
                    background:
                      currentPage === 1
                        ? "#cbd5e1"
                        : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    fontSize: 14,
                    fontWeight: 700
                  }}
                >
                  上一页
                </button>

                <span
                  style={{
                    minWidth: 86,
                    textAlign: "center",
                    color: "#334155",
                    fontSize: 14,
                    fontWeight: 700
                  }}
                >
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    height: 40,
                    padding: "0 16px",
                    background:
                      currentPage === totalPages
                        ? "#cbd5e1"
                        : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    fontSize: 14,
                    fontWeight: 700
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