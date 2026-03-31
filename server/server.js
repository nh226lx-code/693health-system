import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortType, setSortType] = useState("dateDesc");
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const cleanText = (val) => {
    let v = String(val || "").trim();
    v = v.replace(/[\u0000-\u001f]/g, "").trim();
    v = v.replace(/-token$/i, "");
    if (v.includes(",")) v = v.split(",")[0].trim();
    if (v.includes("PK")) return "";
    return v.replace(/[^\x20-\x7E\u4e00-\u9fa5@._-]/g, "");
  };

  const getCreateTime = (id) => {
    try {
      return parseInt(String(id).substring(0, 8), 16) * 1000;
    } catch {
      return 0;
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/users");
      const list = Array.isArray(res.data) ? res.data : [];
      const cleanList = list
        .map((item) => ({
          ...item,
          username: cleanText(item.username),
          email: cleanText(item.email)
        }))
        .filter((item) => item.email);

      setUsers(cleanList);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const key = keyword.trim().toLowerCase();

    let list = users.filter((item) => {
      if (!key) return true;
      return (
        String(item.username || "").toLowerCase().includes(key) ||
        String(item.email || "").toLowerCase().includes(key) ||
        String(item._id || "").toLowerCase().includes(key)
      );
    });

    if (sortType === "dateDesc") {
      list.sort((a, b) => getCreateTime(b._id) - getCreateTime(a._id));
    }

    if (sortType === "dateAsc") {
      list.sort((a, b) => getCreateTime(a._id) - getCreateTime(b._id));
    }

    if (sortType === "nameAsc") {
      list.sort((a, b) =>
        String(a.username || a.email || "").localeCompare(
          String(b.username || b.email || ""),
          "zh-CN"
        )
      );
    }

    if (sortType === "nameDesc") {
      list.sort((a, b) =>
        String(b.username || b.email || "").localeCompare(
          String(a.username || a.email || ""),
          "zh-CN"
        )
      );
    }

    return list;
  }, [users, keyword, sortType]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setMessage("删除成功");
      fetchUsers();
    } catch {
      setMessage("删除失败");
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleImportChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      setImporting(true);
      setMessage("");
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/admin/import-users", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setMessage(res.data?.message || "导入成功");
      fetchUsers();
    } catch {
      setMessage("导入失败");
    } finally {
      setImporting(false);
    }
  };

  const totalCount = filteredUsers.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        background:
          "linear-gradient(180deg, #f4f7fb 0%, #eef3f9 50%, #e9eff7 100%)"
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto"
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "28px 30px",
            boxShadow: "0 10px 40px rgba(15, 23, 42, 0.08)",
            border: "1px solid rgba(15, 23, 42, 0.06)",
            marginBottom: "22px"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap"
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: "700",
                  color: "#0f172a",
                  lineHeight: 1.2,
                  marginBottom: "8px"
                }}
              >
                用户管理
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#64748b"
                }}
              >
                共 {totalCount} 位用户
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap"
              }}
            >
              <div
                style={{
                  minWidth: "260px",
                  height: "46px",
                  background: "#f8fafc",
                  border: "1px solid #dbe3ee",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 14px"
                }}
              >
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="搜索用户名 / 邮箱 / 用户ID"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "14px",
                    color: "#0f172a"
                  }}
                />
              </div>

              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                style={{
                  height: "46px",
                  padding: "0 16px",
                  borderRadius: "14px",
                  border: "1px solid #dbe3ee",
                  background: "#ffffff",
                  fontSize: "14px",
                  color: "#0f172a",
                  outline: "none",
                  cursor: "pointer",
                  minWidth: "180px"
                }}
              >
                <option value="dateDesc">按日期排序（最新）</option>
                <option value="dateAsc">按日期排序（最早）</option>
                <option value="nameAsc">按用户名排序（A-Z）</option>
                <option value="nameDesc">按用户名排序（Z-A）</option>
              </select>

              <button
                onClick={fetchUsers}
                style={{
                  height: "46px",
                  padding: "0 18px",
                  border: "none",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 10px 24px rgba(37, 99, 235, 0.22)"
                }}
              >
                刷新
              </button>

              <button
                onClick={handleImportClick}
                disabled={importing}
                style={{
                  height: "46px",
                  padding: "0 18px",
                  border: "none",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: importing ? "not-allowed" : "pointer",
                  opacity: importing ? 0.7 : 1,
                  boxShadow: "0 10px 24px rgba(13, 148, 136, 0.22)"
                }}
              >
                {importing ? "导入中..." : "导入用户"}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleImportChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {message ? (
            <div
              style={{
                marginTop: "18px",
                padding: "12px 14px",
                borderRadius: "14px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                color: "#334155",
                fontSize: "14px"
              }}
            >
              {message}
            </div>
          ) : null}
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            boxShadow: "0 10px 40px rgba(15, 23, 42, 0.08)",
            border: "1px solid rgba(15, 23, 42, 0.06)",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              overflowX: "auto"
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "980px"
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "linear-gradient(180deg, #f8fbff 0%, #f1f5f9 100%)"
                  }}
                >
                  <th
                    style={{
                      padding: "18px 20px",
                      textAlign: "left",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0f172a",
                      borderBottom: "1px solid #e2e8f0"
                    }}
                  >
                    用户名
                  </th>
                  <th
                    style={{
                      padding: "18px 20px",
                      textAlign: "left",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0f172a",
                      borderBottom: "1px solid #e2e8f0"
                    }}
                  >
                    邮箱
                  </th>
                  <th
                    style={{
                      padding: "18px 20px",
                      textAlign: "left",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0f172a",
                      borderBottom: "1px solid #e2e8f0"
                    }}
                  >
                    用户ID
                  </th>
                  <th
                    style={{
                      padding: "18px 20px",
                      textAlign: "left",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0f172a",
                      borderBottom: "1px solid #e2e8f0"
                    }}
                  >
                    创建时间
                  </th>
                  <th
                    style={{
                      padding: "18px 20px",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0f172a",
                      borderBottom: "1px solid #e2e8f0",
                      width: "140px"
                    }}
                  >
                    操作
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        padding: "48px 20px",
                        textAlign: "center",
                        color: "#64748b",
                        fontSize: "15px"
                      }}
                    >
                      加载中...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        padding: "48px 20px",
                        textAlign: "center",
                        color: "#64748b",
                        fontSize: "15px"
                      }}
                    >
                      暂无用户数据
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      style={{
                        background: index % 2 === 0 ? "#ffffff" : "#fbfdff"
                      }}
                    >
                      <td
                        style={{
                          padding: "18px 20px",
                          borderBottom: "1px solid #eef2f7",
                          color: "#0f172a",
                          fontSize: "14px",
                          fontWeight: "600"
                        }}
                      >
                        {user.username || "-"}
                      </td>
                      <td
                        style={{
                          padding: "18px 20px",
                          borderBottom: "1px solid #eef2f7",
                          color: "#334155",
                          fontSize: "14px"
                        }}
                      >
                        {user.email || "-"}
                      </td>
                      <td
                        style={{
                          padding: "18px 20px",
                          borderBottom: "1px solid #eef2f7",
                          color: "#475569",
                          fontSize: "13px",
                          fontFamily:
                            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
                        }}
                      >
                        {user._id}
                      </td>
                      <td
                        style={{
                          padding: "18px 20px",
                          borderBottom: "1px solid #eef2f7",
                          color: "#475569",
                          fontSize: "14px"
                        }}
                      >
                        {getCreateTime(user._id)
                          ? new Date(getCreateTime(user._id)).toLocaleString("zh-CN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : "-"}
                      </td>
                      <td
                        style={{
                          padding: "18px 20px",
                          borderBottom: "1px solid #eef2f7",
                          textAlign: "center"
                        }}
                      >
                        <button
                          onClick={() => handleDelete(user._id)}
                          style={{
                            height: "38px",
                            minWidth: "88px",
                            border: "none",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                            color: "#ffffff",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            boxShadow: "0 10px 20px rgba(239, 68, 68, 0.18)"
                          }}
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}