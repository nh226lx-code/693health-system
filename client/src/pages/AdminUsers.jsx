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

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data || []);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    const ok = window.confirm("确定删除该用户？");
    if (!ok) return;
    setUsers((prev) => prev.filter((u) => u._id !== id));
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
    return <span style={{ color: "#cbd5e1" }}>⇅</span>;
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (u.role === "admin") return false;

      const email = (u.email || "").toLowerCase();
      const username = (u.username || "").toLowerCase();
      const value = keyword.toLowerCase();

      return email.includes(value) || username.includes(value);
    });
  }, [users, keyword]);

  const sortedUsers = useMemo(() => {
    const list = [...filteredUsers];

    list.sort((a, b) => {
      let v1 = a[sortField] || "";
      let v2 = b[sortField] || "";

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
      user.username || (user.email ? user.email.split("@")[0] : "unknown"),
      user.email || "",
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

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Topbar />

      <div style={{ padding: 28 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            gap: 16,
            flexWrap: "wrap"
          }}
        >
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
            用户管理
          </h2>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              placeholder="按用户名或邮箱搜索"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                padding: 10,
                width: 260,
                borderRadius: 10,
                border: "1px solid #e2e8f0"
              }}
            />

            <button
              style={{
                padding: "10px 16px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 10
              }}
            >
              搜索
            </button>

            <button
              onClick={exportCSV}
              style={{
                padding: "10px 18px",
                background: "#16a34a",
                color: "#fff",
                border: "none",
                borderRadius: 10
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

                {/* 新增：日期排序 */}
                <th
                  style={{ padding: 14, cursor: "pointer" }}
                  onClick={() => handleSort("_id")}
                >
                  日期 {getSortIcon("_id")}
                </th>

                <th
                  style={{ padding: 14, cursor: "pointer" }}
                  onClick={() => handleSort("username")}
                >
                  用户ID {getSortIcon("username")}
                </th>

                <th
                  style={{ padding: 14, cursor: "pointer" }}
                  onClick={() => handleSort("email")}
                >
                  邮箱 {getSortIcon("email")}
                </th>

                {/* 角色不排序 */}
                <th style={{ padding: 14 }}>
                  角色
                </th>

                <th style={{ padding: 14 }}>操作</th>
              </tr>
            </thead>

            <tbody>
              {pagedUsers.map((user, index) => (
                <tr key={user._id} style={{ borderBottom: "1px solid #eef2f7" }}>
                  <td style={{ padding: 14 }}>
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>

                  {/* 显示日期（用 _id） */}
                  <td style={{ padding: 14 }}>{user._id}</td>

                  <td style={{ padding: 14 }}>
                    {user.username || (user.email ? user.email.split("@")[0] : "unknown")}
                  </td>

                  <td style={{ padding: 14 }}>{user.email}</td>

                  <td style={{ padding: 14 }}>{user.role}</td>

                  <td style={{ padding: 14 }}>
                    <button
                      onClick={() => handleDelete(user._id)}
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

          {sortedUsers.length === 0 && (
            <div style={{ textAlign: "center", padding: 30 }}>
              无匹配用户
            </div>
          )}

          {sortedUsers.length > 0 && (
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
                共 {sortedUsers.length} 条，每页 20 条
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                  上一页
                </button>

                <span>
                  {currentPage} / {totalPages}
                </span>

                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
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