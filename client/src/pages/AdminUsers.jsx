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

       
        const fakeUsers = res.data.map((item, i) => ({
          _id: i,
          email: "user" + (i + 1) + "@test.com",
          role: "user"
        }));

      
        fakeUsers.unshift({
          _id: "admin",
          email: "test@admin.com",
          role: "admin"
        });

        setUsers(fakeUsers);
      } catch (err) {
        alert("获取用户失败");
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Topbar />

      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          {/* ✅ 放大标题 */}
          <h2 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: "#0f172a" }}>
            用户管理
          </h2>
        </div>

        {/* ✅ 搜索框 */}
        <input
          placeholder="按用户名搜索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            padding: 10,
            marginBottom: 20,
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
              tableLayout: "fixed" 
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: 14 }}>邮箱</th>
                <th style={{ padding: 14 }}>角色</th>
                <th style={{ padding: 14 }}>用户ID</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} style={{ borderBottom: "1px solid #eef2f7" }}>
                  <td style={{ padding: 14 }}>{user.email}</td>

                  <td style={{ padding: 14 }}>
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

                  <td style={{ padding: 14 }}>{user._id}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
              无匹配用户
            </div>
          )}
        </div>
      </div>
    </div>
  );
}