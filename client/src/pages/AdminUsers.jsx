import React, { useEffect, useState } from "react";
import API from "../services/api";
import Topbar from "../components/Topbar.jsx";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortType, setSortType] = useState("newest");

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
    setUsers(users.filter((u) => u._id !== id));
  };

  // 搜索（邮箱 + 用户名）
  const filtered = users.filter((u) => {
    if (u.role === "admin") return false;

    const email = (u.email || "").toLowerCase();
    const username = (u.username || "").toLowerCase();

    return (
      email.includes(keyword.toLowerCase()) ||
      username.includes(keyword.toLowerCase())
    );
  });

  // 排序
  const sorted = [...filtered].sort((a, b) => {
    if (sortType === "newest") {
      return b._id.localeCompare(a._id);
    }
    if (sortType === "oldest") {
      return a._id.localeCompare(b._id);
    }
    if (sortType === "email") {
      return (a.email || "").localeCompare(b.email || "");
    }
    return 0;
  });

  // 导出CSV
  const exportCSV = () => {
    const headers = ["用户ID", "邮箱", "角色"];

    const rows = sorted.map((u) => [
      u.username || u.email.split("@")[0],
      u.email,
      u.role
    ]);

    const csvContent =
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "users_data.csv";
    a.click();
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
            marginBottom: 20
          }}
        >
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
            用户管理
          </h2>

          <div style={{ display: "flex", gap: 10 }}>
            {/* 搜索 */}
            <input
              placeholder="搜索用户名或邮箱"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                padding: 10,
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
                <th style={{ padding: 14 }}>用户ID</th>
                <th style={{ padding: 14 }}>邮箱</th>
                <th style={{ padding: 14 }}>角色</th>
                <th style={{ padding: 14 }}>操作</th>
              </tr>
            </thead>

            <tbody>
              {sorted.map((user) => (
                <tr key={user._id}>
                  <td style={{ padding: 14 }}>
                    {user.username || user.email.split("@")[0]}
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

          {sorted.length === 0 && (
            <div style={{ textAlign: "center", padding: 30 }}>
              无匹配用户
            </div>
          )}
        </div>
      </div>
    </div>
  );
}