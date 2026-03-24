import React, { useEffect, useState } from "react";
import API from "../services/api";
import Topbar from "../components/Topbar.jsx";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/health");

        const list = res.data.map((item, i) => ({
          _id: i,
          email: "user" + (i + 1) + "@test.com",
          role: "user"
        }));

        list.unshift({
          _id: "admin",
          email: "test@admin.com",
          role: "admin"
        });

        setUsers(list);
      } catch {
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    const ok = window.confirm("确定删除该用户？");
    if (!ok) return;

    setUsers(users.filter((u) => u._id !== id));
  };

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Topbar />

      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: "#0f172a"
            }}
          >
            用户管理
          </h2>
        </div>

        <input
          placeholder="按邮箱搜索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            padding: 10,
            marginBottom: 16,
            width: 260,
            borderRadius: 10,
            border: "1px solid #e2e8f0"
          }}
        />

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
              textAlign: "center" // ✅ 只加这一行（居中）
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: 14, textAlign: "center" }}>邮箱</th>
                <th style={{ padding: 14, textAlign: "center" }}>角色</th>
                <th style={{ padding: 14, textAlign: "center" }}>用户ID</th>
                <th style={{ padding: 14, textAlign: "center" }}>操作</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((user) => (
                <tr key={user._id} style={{ borderBottom: "1px solid #eef2f7" }}>
                  <td style={{ padding: 14, textAlign: "center" }}>{user.email}</td>

                  <td style={{ padding: 14, textAlign: "center" }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        background:
                          user.role === "admin" ? "#dbeafe" : "#dcfce7",
                        color:
                          user.role === "admin" ? "#2563eb" : "#16a34a",
                        fontWeight: 600,
                        fontSize: 13
                      }}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td style={{ padding: 14, textAlign: "center" }}>{user._id}</td>

                  <td style={{ padding: 14, textAlign: "center" }}>
                    {user.role !== "admin" && (
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
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
              无匹配用户
            </div>
          )}
        </div>
      </div>
    </div>
  );
}