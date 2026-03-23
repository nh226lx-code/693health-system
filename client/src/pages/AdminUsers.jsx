import React, { useEffect, useState } from "react";
import API from "../services/api";
import Topbar from "../components/Topbar.jsx";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        alert("获取用户失败");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Topbar />

      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#0f172a" }}>
            用户管理
          </h2>
          <p style={{ marginTop: 8, color: "#64748b" }}>
            查看系统中的全部注册用户及其角色信息
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 20,
            boxShadow: "0 10px 30px rgba(15,23,42,0.06)"
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ textAlign: "left", padding: 14 }}>邮箱</th>
                <th style={{ textAlign: "left", padding: 14 }}>角色</th>
                <th style={{ textAlign: "left", padding: 14 }}>用户ID</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={{ borderBottom: "1px solid #eef2f7" }}>
                  <td style={{ padding: 14 }}>{user.email}</td>
                  <td style={{ padding: 14 }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        background: user.role === "admin" ? "#dbeafe" : "#dcfce7",
                        color: user.role === "admin" ? "#2563eb" : "#16a34a",
                        fontWeight: 600,
                        fontSize: 13
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: 14, color: "#64748b", fontSize: 13 }}>
                    {user._id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}