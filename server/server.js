const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ 加这一行
app.use("/api/auth", require("./routes/authRoutes"));

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/api/health", (req, res) => {
  res.json({ message: "ok" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});