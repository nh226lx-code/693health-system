import React, { useEffect, useState } from "react";
import API from "../services/api";
import Topbar from "../components/Topbar.jsx";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const fetchUsers = async () => {
    try {
      // ✅ 正确：从 users 表获取
      const res = await API.get("/users");
      setUsers(res.data);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ 新增用户（真正写入数据库）
  const handleAddUser = async () => {
    if (!email || !password) return;

    try {
      await API.post("/users", {
        email,
        password,
        role
      });

      setEmail("");
      setPassword("");
      setRole("user");

      fetchUsers(); // 刷新列表
    } catch {
      alert("创建失败");
    }
  };

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
        {/* 标题 + 搜索 */}
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

        {/* 新增用户 */}
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            gap: 10
          }}
        >
          <input
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          />

          <input
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: 10, borderRadius: 8 }}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>

          <button
            onClick={handleAddUser}
            style={{
              background: "#22c55e",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            添加用户
          </button>
        </div>

        {/* 表格 */}
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
                  <td style={{ padding: 14 }}>{user._id}</td>
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