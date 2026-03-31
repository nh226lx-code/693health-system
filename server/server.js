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

const clean = (val) => {
  let v = String(val || "").trim();
  v = v.replace(/-token$/i, "");
  v = v.replace(/^"+|"+$/g, "").trim();
  v = v.replace(/[\u0000-\u001f]/g, "").trim();
  if (v.includes(",")) v = v.split(",")[0].trim();
  return v;
};

/* ===== 强制清洗数据库（启动即执行）===== */
const fixData = async () => {
  const users = await User.find();
  for (let u of users) {
    const email = clean(u.email);
    if (email && u.email !== email) {
      u.email = email;
      u.username = email.split("@")[0];
      await u.save();
    }
  }

  const records = await Health.find();
  for (let r of records) {
    const email = clean(r.user);
    if (email && r.user !== email) {
      r.user = email;
      await r.save();
    }
  }

  console.log("数据清洗完成");
};

mongoose.connection.once("open", async () => {
  await fixData();
});

/* ===== 登录 ===== */
app.post("/api/auth/login", async (req, res) => {
  try {
    const email = clean(req.body.email);
    const password = req.body.password;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({});

    let ok = false;

    if (user.password && user.password.startsWith("$2")) {
      ok = await bcrypt.compare(password, user.password);
    } else {
      ok = password === user.password;
    }

    if (!ok) return res.status(400).json({});

    const role = user.role === "admin" ? "admin" : "user";

    res.json({
      token: role === "admin" ? "admin-token" : email + "-token",
      role,
      userId: email
    });
  } catch {
    res.json({});
  }
});

/* ===== 用户 ===== */
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.json([]);
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const email = clean(req.body.email);
    if (!email) return res.json({});

    const exist = await User.findOne({ email });
    if (exist) return res.json(exist);

    const user = await User.create({
      email,
      username: email.split("@")[0],
      password: await bcrypt.hash("123456", 10),
      role: "user"
    });

    res.json(user);
  } catch {
    res.json({});
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) await Health.deleteMany({ user: user.email });
    res.json({});
  } catch {
    res.json({});
  }
});

/* ===== 报告 ===== */
app.get("/api/health", async (req, res) => {
  try {
    const data = await Health.find().sort({ date: -1 });
    res.json(data);
  } catch {
    res.json([]);
  }
});

app.post("/api/health", async (req, res) => {
  try {
    const email = clean(req.body.user);
    if (!email) return res.json({});

    const date = new Date(
      req.body.date || new Date()
    ).toISOString().slice(0, 10);

    const exist = await User.findOne({ email });
    if (!exist) {
      await User.create({
        email,
        username: email.split("@")[0],
        password: await bcrypt.hash("123456", 10),
        role: "user"
      });
    }

    await Health.create({
      user: email,
      date,
      steps: Number(req.body.steps) || 0,
      sleep: Number(req.body.sleep) || 0,
      water: Number(req.body.water) || 0,
      weight: Number(req.body.weight) || 0
    });

    res.json({});
  } catch {
    res.json({});
  }
});

app.delete("/api/health/:id", async (req, res) => {
  try {
    await Health.findByIdAndDelete(req.params.id);
    res.json({});
  } catch {
    res.json({});
  }
});

/* ===== 前端 ===== */
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  if (req.originalUrl.startsWith("/api")) return res.status(404).end();
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(process.env.PORT || 5000);