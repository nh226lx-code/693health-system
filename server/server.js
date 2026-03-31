const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const HealthSchema = new mongoose.Schema({
  date: String,
  user: String,
  steps: Number,
  sleep: Number,
  water: Number,
  weight: Number
});

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String
});

const Health = mongoose.models.Health || mongoose.model("Health", HealthSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "请输入邮箱和密码" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "用户不存在" });
    }

    let isMatch = false;

    if (user.password && user.password.startsWith("$2")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password;
    }

    if (!isMatch) {
      return res.status(400).json({ message: "密码错误" });
    }

    const role = user.role === "admin" ? "admin" : "user";
    const token = role === "admin" ? "admin-token" : email + "-token";

    return res.json({
      token,
      role,
      userId: email
    });
  } catch {
    return res.status(500).json({ message: "服务器错误" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const clean = users.map((u) => {
      let email = String(u.email || "").trim();

      email = email.replace(/-token$/i, "");
      email = email.replace(/^"+|"+$/g, "").trim();
      email = email.replace(/[\u0000-\u001f]/g, "").trim();

      if (email.includes(",")) {
        email = email.split(",")[0].trim();
      }

      return {
        ...u.toObject(),
        email,
        username: email ? email.split("@")[0] : u.username
      };
    });

    res.json(clean);
  } catch {
    res.json([]);
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { email, password, role, username } = req.body;

    if (!email) {
      return res.json({ message: "fail" });
    }

    const cleanEmail = String(email)
      .trim()
      .replace(/-token$/i, "")
      .replace(/^"+|"+$/g, "")
      .replace(/[\u0000-\u001f]/g, "");

    const exist = await User.findOne({ email: cleanEmail });

    if (exist) {
      return res.json({
        _id: exist._id,
        email: exist.email,
        role: exist.role
      });
    }

    const hash = await bcrypt.hash(password || "123456", 10);

    const user = await User.create({
      email: cleanEmail,
      username: username || cleanEmail.split("@")[0],
      password: hash,
      role: role === "admin" ? "admin" : "user"
    });

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role
    });
  } catch {
    res.json({ message: "error" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (user && user.email) {
      await Health.deleteMany({ user: String(user.email).trim() });
    }

    res.json({ message: "ok" });
  } catch {
    res.json({ message: "error" });
  }
});

app.post("/api/health", async (req, res) => {
  try {
    const date = new Date(
      req.body.date || req.body.recordDate || new Date()
    ).toISOString().slice(0, 10);

    let user = String(req.body.user || "").trim();

    user = user.replace(/-token$/i, "").trim();
    user = user.replace(/^"+|"+$/g, "").trim();
    user = user.replace(/[\u0000-\u001f]/g, "").trim();

    if (user.includes(",")) {
      user = user.split(",")[0].trim();
    }

    if (!user.includes("@")) {
      return res.json({ message: "error" });
    }

    const email = user;

    const existUser = await User.findOne({ email });

    if (!existUser) {
      const hash = await bcrypt.hash("123456", 10);

      await User.create({
        email,
        username: email.split("@")[0],
        password: hash,
        role: "user"
      });
    }

    await Health.create({
      date,
      user: email,
      steps: Number(req.body.steps) || 0,
      sleep: Number(req.body.sleep) || 0,
      water: Number(req.body.water) || 0,
      weight: Number(req.body.weight) || 0
    });

    res.json({ message: "ok" });
  } catch {
    res.json({ message: "error" });
  }
});

app.get("/api/health", async (req, res) => {
  try {
    const data = await Health.find().sort({ date: -1 });

    const clean = data.map((item) => {
      let user = String(item.user || "").trim();

      user = user.replace(/-token$/i, "");
      user = user.replace(/^"+|"+$/g, "").trim();
      user = user.replace(/[\u0000-\u001f]/g, "").trim();

      if (user.includes(",")) {
        user = user.split(",")[0].trim();
      }

      return {
        ...item.toObject(),
        user
      };
    });

    res.json(clean);
  } catch {
    res.json([]);
  }
});

app.delete("/api/health/:id", async (req, res) => {
  try {
    await Health.findByIdAndDelete(req.params.id);
    res.json({ message: "ok" });
  } catch {
    res.json({ message: "error" });
  }
});

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ message: "API not found" });
  }
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});