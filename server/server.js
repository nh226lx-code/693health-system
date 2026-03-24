const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb+srv://nh226lx_db_user:PwESjIbUfG1zW7Ct@cluster0.xwiv1xa.mongodb.net/health-system?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB connected"))
  .catch(() => console.log("MongoDB error"));

app.use(cors());
app.use(express.json());

// ====== auth ======
app.post("/api/auth/login", (req, res) => {
  res.json({ token: "ok", role: "user" });
});

app.post("/api/auth/register", (req, res) => {
  res.json("ok");
});

// ====== health（补上你缺的）=====
app.get("/api/health", (req, res) => {
  res.json({ message: "ok" });
});

app.post("/api/health", (req, res) => {
  res.json({ message: "saved", data: req.body });
});

// ====== 前端 ======
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});