const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://nh226lx_db_user:PwESjIbUfG1zW7Ct@cluster0.xwiv1xa.mongodb.net/health-system?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB connected"))
  .catch(() => console.log("MongoDB error"));

process.env.JWT_SECRET = "123456";

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "ok" });
});

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) return res.status(404).end();
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});