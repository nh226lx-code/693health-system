import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔥 加 token
        const token = localStorage.getItem("token");
        if (token) {
          API.defaults.headers.common["Authorization"] = token;
        }

        const res = await API.get("/health");
        setData(res.data);
      } catch (err) {
        console.log(err);
        alert("未登录，请先登录");
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>历史记录</h2>

      {data.length === 0 && <p>暂无数据</p>}

      {data.map((item, index) => (
        <div key={index} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p>步数：{item.steps}</p>
          <p>睡眠：{item.sleepHours} 小时</p>
          <p>饮水：{item.waterIntake} L</p>
          <p>体重：{item.weight} kg</p>
          <p>身高：{item.height} cm</p>
        </div>
      ))}
    </div>
  );
}