import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import Topbar from "../components/Topbar.jsx";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");

  const [sortField, setSortField] = useState("_id");
  const [sortOrder, setSortOrder] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 20;

  const cleanEmail = (value) => {
    if (!value) return "";
    let text = String(value).trim();
    text = text.replace(/-token$/i, "");
    text = text.replace(/^"+|"+$/g, "").trim();
    text = text.replace(/[\u0000-\u001f]/g, "").trim();
    text = text.replace(/\s+/g, "");
    if (text.includes(",")) {
      text = text.split(",")[0].trim();
    }
    return text;
  };

  const safeEmail = (value) => {
    let v = cleanEmail(value);
    v = v.replace(/[^a-zA-Z0-9@._-]/g, "");
    return v;
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users?_t=" + Date.now());

      if (!Array.isArray(res.data)) {
        setUsers([]);
        return;
      }

      const list = res.data
        .map((u) => {
          const email = safeEmail(u.email || "");

          return {
            ...u,
            email,
            username: u.username || (email ? email.split("@")[0] : "")
          };
        })
        .filter((u) => {
          const e = u.email || "";
          return e && e.includes("@") && e.includes(".");
        });

      setUsers(list);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    setUsers([]);
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("确定删除该用户？");
    if (!ok) return;

    try {
      await API.delete(`/users/${id}`);
      await fetchUsers();
    } catch {
      alert("删除失败");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      if (field === "_id") {
        setSortOrder("desc");
      } else {
        setSortOrder("asc");
      }
    }
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return "⇅";
  };

  const filteredUsers = useMemo(() => {
    const value = (keyword || "").toLowerCase();

    return users.filter((u) => {
      if (String(u.role || "").toLowerCase() === "admin") return false;

      const email = safeEmail(u.email || "").toLowerCase();
      const username = String(u.username || "").toLowerCase();

      if (!email) return false;

      return email.includes(value) || username.includes(value);
    });
  }, [users, keyword]);

  const sortedUsers = useMemo(() => {
    const list = [...filteredUsers];

    list.sort((a, b) => {
      if (sortField === "_id") {
        const t1 = parseInt((a._id || "").substring(0, 8), 16) || 0;
        const t2 = parseInt((b._id || "").substring(0, 8), 16) || 0;
        return sortOrder === "asc" ? t1 - t2 : t2 - t1;
      }

      let v1 =
        sortField === "email"
          ? safeEmail(a[sortField] || "").toLowerCase()
          : String(a[sortField] || "").toLowerCase();

      let v2 =
        sortField === "email"
          ? safeEmail(b[sortField] || "").toLowerCase()
          : String(b[sortField] || "").toLowerCase();

      if (v1 < v2) return sortOrder === "asc" ? -1 : 1;
      if (v1 > v2) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [filteredUsers, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, sortField, sortOrder]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, currentPage]);

  const exportCSV = () => {
    const headers = ["序号", "用户ID", "邮箱", "角色"];

    const rows = sortedUsers.map((user, i) => [
      i + 1,
      user.username || (user.email ? safeEmail(user.email).split("@")[0] : "unknown"),
      safeEmail(user.email || ""),
      user.role || ""
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
    a.download = "users_data.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const handleImportUsers = (e) => {
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

        let successCount = 0;

        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i].split(",");

          const email = safeEmail(cols[0] || "");
          const username = String(cols[1] || "").trim();

          if (!email) continue;

          await API.post("/users", {
            email,
            username: username || email.split("@")[0],
            password: "123456",
            role: "user"
          }).catch(() => {});

          successCount++;
        }

        await fetchUsers();
        alert(`导入成功，共 ${successCount} 条`);
      } catch {
        alert("导入失败，请检查CSV格式");
      }

      e.target.value = "";
    };

    reader.readAsText(file);
  };

  const btnBase = {
    height: 42,
    padding: "0 18px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f6fb" }}>
      <Topbar />

      <div style={{ padding: 28 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
            gap: 14,
            flexWrap: "wrap"
          }}
        >
          <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>
            用户管理
          </h2>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center"
            }}
          >
            <input
              placeholder="搜索用户ID或邮箱"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                height: 42,
                padding: "0 12px",
                width: 260,
                borderRadius: 10,
                border: "1px solid #dbe3ee"
              }}
            />

            <button
              style={{
                ...btnBase,
                background: "#2563eb",
                color: "#fff"
              }}
            >
              搜索
            </button>

            <input
              id="import-user"
              type="file"
              accept=".csv"
              onChange={handleImportUsers}
              style={{ display: "none" }}
            />

            <label htmlFor="import-user">
              <span
                style={{
                  ...btnBase,
                  background: "#2563eb",
                  color: "#fff"
                }}
              >
                导入用户
              </span>
            </label>

            <button
              onClick={exportCSV}
              style={{
                ...btnBase,
                background: "#16a34a",
                color: "#fff"
              }}
            >
              导出用户
            </button>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 22,
            boxShadow: "0 18px 40px rgba(15,23,42,0.06)"
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
                <th style={{ padding: 16 }}>序号</th>

                <th style={{ padding: 16 }}>日期</th>

                <th style={{ padding: 16 }}>用户ID</th>

                <th style={{ padding: 16 }}>邮箱</th>

                <th style={{ padding: 16 }}>角色</th>

                <th style={{ padding: 16 }}>操作</th>
              </tr>
            </thead>

            <tbody>
              {pagedUsers.map((user, index) => {
                const timestamp = parseInt((user._id || "").substring(0, 8), 16) * 1000;
                const date = timestamp ? new Date(timestamp).toISOString().slice(0, 10) : "-";

                return (
                  <tr key={user._id}>
                    <td style={{ padding: 16 }}>
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>

                    <td style={{ padding: 16 }}>{date}</td>

                    <td style={{ padding: 16 }}>
                      {user.username}
                    </td>

                    <td style={{ padding: 16 }}>
                      {safeEmail(user.email)}
                    </td>

                    <td style={{ padding: 16 }}>{user.role}</td>

                    <td style={{ padding: 16 }}>
                      <button
                        onClick={() => handleDelete(user._id)}
                        style={{
                          height: 36,
                          padding: "0 16px",
                          borderRadius: 10,
                          border: "none",
                          cursor: "pointer",
                          fontWeight: 700,
                          color: "#fff",
                          background: "#ef4444"
                        }}
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {sortedUsers.length === 0 && (
            <div style={{ textAlign: "center", padding: 40 }}>
              无数据
            </div>
          )}
        </div>
      </div>
    </div>
  );
}