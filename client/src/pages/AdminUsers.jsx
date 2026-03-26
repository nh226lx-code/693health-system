import React, { useEffect, useState } from "react";
import API from "../services/api";
import Topbar from "../components/Topbar.jsx";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");

      // ✅ 关键：按时间倒序（最新在前）
      const sorted = (res.data || []).sort(
        (a, b) => new Date(b._id) - new Date(a._id)
      );

      setUsers(sorted);

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

  const filtered = users.filter((u) =>
    u.role !== "admin" &&
    (u.email || "").toLowerCase().includes(keyword.toLowerCase())
  );

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

          <input
            placeholder="按邮箱搜索"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              padding: 10,
              width: 260,
              borderRadius: 10,
              border: "1px solid #e2e8f0"
            }}
          />
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
              {filtered.map((user) => (
                <tr key={user._id}>
                  <td style={{ padding: 14 }}>
                    {user.username || user.email.split("@")[0]}
                  </td>

                  <td style={{ padding: 14 }}>{user.email}</td>
                  <td style={{ padding: 14 }}>{user.role}</td>

                  <td style={{ padding: 14 }}>
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
            <div style={{ textAlign: "center", padding: 30 }}>
              无匹配用户
            </div>
          )}
        </div>
      </div>
    </div>
  );
}